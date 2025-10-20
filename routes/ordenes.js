const express = require('express');
const db = require('../config/database');
const router = express.Router();

// POST /api/ordenes - Crear una nueva orden
router.post('/', async (req, res) => {
    const client = await db.pool.connect();
    
    try {
        await client.query('BEGIN');

        const { items, usuario } = req.body;

        // Validar que existan items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'La orden debe contener al menos un producto'
            });
        }

        // Crear usuario si se proporciona
        let usuarioId = null;
        if (usuario && usuario.email) {
            const usuarioResult = await client.query(
                `INSERT INTO usuarios (nombre, email, telefono, direccion) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (email) DO UPDATE SET 
                 nombre = EXCLUDED.nombre,
                 telefono = EXCLUDED.telefono,
                 direccion = EXCLUDED.direccion
                 RETURNING id`,
                [usuario.nombre, usuario.email, usuario.telefono, usuario.direccion]
            );
            usuarioId = usuarioResult.rows[0].id;
        }

        // Verificar stock y calcular total
        let total = 0;
        const itemsValidados = [];

        for (let item of items) {
            const productoResult = await client.query(
                'SELECT * FROM productos WHERE id = $1 AND activo = true',
                [item.producto_id]
            );

            if (productoResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    error: `Producto con ID ${item.producto_id} no encontrado`
                });
            }

            const producto = productoResult.rows[0];

            if (producto.stock < item.cantidad) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    error: `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`
                });
            }

            const subtotal = producto.precio * item.cantidad;
            total += subtotal;

            itemsValidados.push({
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: producto.precio,
                subtotal: subtotal,
                nombre: producto.nombre
            });
        }

        // Crear la orden
        const ordenResult = await client.query(
            'INSERT INTO ordenes (usuario_id, total, estado) VALUES ($1, $2, $3) RETURNING *',
            [usuarioId, total, 'pendiente']
        );

        const orden = ordenResult.rows[0];

        // Crear los items de la orden
        for (let item of itemsValidados) {
            await client.query(
                'INSERT INTO orden_items (orden_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [orden.id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
            );

            // Actualizar stock
            await client.query(
                'UPDATE productos SET stock = stock - $1 WHERE id = $2',
                [item.cantidad, item.producto_id]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            orden: {
                ...orden,
                items: itemsValidados
            },
            message: 'Orden creada exitosamente'
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creando orden:', err);
        res.status(500).json({
            success: false,
            error: 'Error creando la orden'
        });
    } finally {
        client.release();
    }
});

// GET /api/ordenes/:id - Obtener una orden por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de orden inválido'
            });
        }

        // Obtener la orden
        const ordenResult = await db.query(
            `SELECT o.*, u.nombre as usuario_nombre, u.email as usuario_email
             FROM ordenes o
             LEFT JOIN usuarios u ON o.usuario_id = u.id
             WHERE o.id = $1`,
            [id]
        );

        if (ordenResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada'
            });
        }

        // Obtener los items de la orden
        const itemsResult = await db.query(
            `SELECT oi.*, p.nombre as producto_nombre, p.imagen_url
             FROM orden_items oi
             JOIN productos p ON oi.producto_id = p.id
             WHERE oi.orden_id = $1`,
            [id]
        );

        const orden = {
            ...ordenResult.rows[0],
            items: itemsResult.rows
        };

        res.json({
            success: true,
            orden: orden
        });

    } catch (err) {
        console.error('Error obteniendo orden:', err);
        res.status(500).json({
            success: false,
            error: 'Error obteniendo la orden'
        });
    }
});

// PUT /api/ordenes/:id/estado - Actualizar estado de orden
router.put('/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, flow_token, flow_order } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de orden inválido'
            });
        }

        const estadosValidos = ['pendiente', 'pagada', 'cancelada', 'enviada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado inválido'
            });
        }

        let query = 'UPDATE ordenes SET estado = $1';
        let params = [estado];
        let paramCount = 1;

        if (flow_token) {
            paramCount++;
            query += `, flow_token = $${paramCount}`;
            params.push(flow_token);
        }

        if (flow_order) {
            paramCount++;
            query += `, flow_order = $${paramCount}`;
            params.push(flow_order);
        }

        query += ` WHERE id = $${paramCount + 1} RETURNING *`;
        params.push(id);

        const result = await db.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada'
            });
        }

        res.json({
            success: true,
            orden: result.rows[0],
            message: 'Estado de orden actualizado'
        });

    } catch (err) {
        console.error('Error actualizando estado de orden:', err);
        res.status(500).json({
            success: false,
            error: 'Error actualizando estado de orden'
        });
    }
});

module.exports = router;