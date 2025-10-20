const express = require('express');
const db = require('../config/database');
const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { categoria, buscar } = req.query;
        let query = 'SELECT * FROM productos WHERE activo = true';
        let params = [];
        let paramCount = 0;

        if (categoria) {
            paramCount++;
            query += ` AND categoria = $${paramCount}`;
            params.push(categoria);
        }

        if (buscar) {
            paramCount++;
            query += ` AND (nombre ILIKE $${paramCount} OR descripcion ILIKE $${paramCount})`;
            params.push(`%${buscar}%`);
        }

        query += ' ORDER BY fecha_creacion DESC';

        const result = await db.query(query, params);
        res.json({
            success: true,
            productos: result.rows,
            total: result.rows.length
        });
    } catch (err) {
        console.error('Error obteniendo productos:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error obteniendo productos' 
        });
    }
});

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de producto inválido'
            });
        }

        const result = await db.query(
            'SELECT * FROM productos WHERE id = $1 AND activo = true',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            producto: result.rows[0]
        });
    } catch (err) {
        console.error('Error obteniendo producto:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error obteniendo producto' 
        });
    }
});

// GET /api/productos/utils/categorias - Obtener todas las categorías
router.get('/utils/categorias', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT DISTINCT categoria FROM productos WHERE activo = true ORDER BY categoria'
        );

        res.json({
            success: true,
            categorias: result.rows.map(row => row.categoria)
        });
    } catch (err) {
        console.error('Error obteniendo categorías:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error obteniendo categorías' 
        });
    }
});

// PUT /api/productos/:id/stock - Actualizar stock (para uso interno)
router.put('/:id/stock', async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de producto inválido'
            });
        }

        if (!cantidad || isNaN(cantidad)) {
            return res.status(400).json({
                success: false,
                error: 'Cantidad inválida'
            });
        }

        const result = await db.query(
            'UPDATE productos SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING *',
            [cantidad, id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Stock insuficiente o producto no encontrado'
            });
        }

        res.json({
            success: true,
            producto: result.rows[0],
            message: 'Stock actualizado correctamente'
        });
    } catch (err) {
        console.error('Error actualizando stock:', err);
        res.status(500).json({ 
            success: false,
            error: 'Error actualizando stock' 
        });
    }
});

module.exports = router;