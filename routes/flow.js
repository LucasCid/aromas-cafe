const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const db = require('../config/database');
const router = express.Router();

// Configuración de Flow - DEBES reemplazar con tus credenciales reales
const FLOW_CONFIG = {
    apiKey: process.env.FLOW_API_KEY || '39DF8158-8118-4CE5-8566-4E4ALD83864B',
    secretKey: process.env.FLOW_SECRET_KEY || '32e21ed1cc7ca36114f033dd4b693d624603405b',
    apiURL: process.env.FLOW_API_URL || 'https://www.flow.cl/api', 
    baseURL: process.env.BASE_URL || 'https://aromas-cafe.onrender.com'
};

// Función para generar firma HMAC-SHA256
function generateSignature(data, secretKey) {
    const sortedData = Object.keys(data)
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('&');
    
    return crypto
        .createHmac('sha256', secretKey)
        .update(sortedData)
        .digest('hex');
}

// POST /api/flow/create-payment - Crear pago en Flow
router.post('/create-payment', async (req, res) => {
    try {
        const { ordenId } = req.body;

        if (!ordenId || isNaN(ordenId)) {
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
             WHERE o.id = $1 AND o.estado = 'pendiente'`,
            [ordenId]
        );

        if (ordenResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Orden no encontrada o ya procesada'
            });
        }

        const orden = ordenResult.rows[0];

        // Parámetros para Flow
        const paymentData = {
            apiKey: FLOW_CONFIG.apiKey,
            commerceOrder: `ORDER-${orden.id}-${Date.now()}`,
            subject: `Compra en Mi Ecommerce - Orden #${orden.id}`,
            currency: 'CLP',
            amount: Math.round(orden.total), // Flow requiere enteros
            email: orden.usuario_email || 'cliente@ejemplo.com',
            paymentMethod: 9, // 9 = Todos los medios
            urlConfirmation: `https://tu-app.render.com/api/flow/confirm`,
urlReturn: `https://tu-app.render.com/payment-result`,
            timeout: 3600 // 1 hora
        };

        // Generar firma
        paymentData.s = generateSignature(paymentData, FLOW_CONFIG.secretKey);

        console.log('Enviando datos a Flow:', { ...paymentData, s: '[HIDDEN]' });

        // Realizar petición a Flow
        const response = await axios.post(
            `${FLOW_CONFIG.apiURL}/payment/create`,
            new URLSearchParams(paymentData).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const flowResponse = response.data;

        if (!flowResponse.token) {
            console.error('Error en respuesta de Flow:', flowResponse);
            return res.status(400).json({
                success: false,
                error: 'Error al crear el pago en Flow',
                details: flowResponse
            });
        }

        // Actualizar orden con token de Flow
        await db.query(
            'UPDATE ordenes SET flow_token = $1, flow_order = $2 WHERE id = $3',
            [flowResponse.token, paymentData.commerceOrder, orden.id]
        );

        // URL de redirección a Flow
        const paymentURL = `${FLOW_CONFIG.apiURL}/payment/page?token=${flowResponse.token}`;

        res.json({
            success: true,
            paymentURL: paymentURL,
            token: flowResponse.token,
            commerceOrder: paymentData.commerceOrder,
            message: 'Pago creado exitosamente'
        });

    } catch (error) {
        console.error('Error creando pago en Flow:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Error creando el pago',
            details: error.response?.data || error.message
        });
    }
});

// POST /api/flow/confirm - Confirmación de pago desde Flow
router.post('/confirm', async (req, res) => {
    try {
        console.log('Confirmación recibida de Flow:', req.body);

        const token = req.body.token;

        if (!token) {
            return res.status(400).send('Token no proporcionado');
        }

        // Obtener información del pago desde Flow
        const statusData = {
            apiKey: FLOW_CONFIG.apiKey,
            token: token
        };

        statusData.s = generateSignature(statusData, FLOW_CONFIG.secretKey);

        const response = await axios.post(
            `${FLOW_CONFIG.apiURL}/payment/getStatus`,
            new URLSearchParams(statusData).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const paymentStatus = response.data;
        console.log('Estado del pago desde Flow:', paymentStatus);

        // Buscar la orden por flow_token
        const ordenResult = await db.query(
            'SELECT * FROM ordenes WHERE flow_token = $1',
            [token]
        );

        if (ordenResult.rows.length === 0) {
            console.error('Orden no encontrada para token:', token);
            return res.status(404).send('Orden no encontrada');
        }

        const orden = ordenResult.rows[0];

        // Actualizar estado según respuesta de Flow
        let nuevoEstado = 'pendiente';
        if (paymentStatus.status === 2) { // 2 = Pagado
            nuevoEstado = 'pagada';
        } else if (paymentStatus.status === 3) { // 3 = Rechazado
            nuevoEstado = 'cancelada';
        }

        await db.query(
            'UPDATE ordenes SET estado = $1 WHERE id = $2',
            [nuevoEstado, orden.id]
        );

        console.log(`Orden ${orden.id} actualizada a estado: ${nuevoEstado}`);

        res.status(200).send('OK');

    } catch (error) {
        console.error('Error en confirmación de Flow:', error.response?.data || error.message);
        res.status(500).send('Error interno');
    }
});

// GET /api/flow/status/:token - Consultar estado de pago
router.get('/status/:token', async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }

        // Consultar estado en Flow
        const statusData = {
            apiKey: FLOW_CONFIG.apiKey,
            token: token
        };

        statusData.s = generateSignature(statusData, FLOW_CONFIG.secretKey);

        const response = await axios.post(
            `${FLOW_CONFIG.apiURL}/payment/getStatus`,
            new URLSearchParams(statusData).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const paymentStatus = response.data;

        // Buscar orden local
        const ordenResult = await db.query(
            'SELECT * FROM ordenes WHERE flow_token = $1',
            [token]
        );

        let orden = null;
        if (ordenResult.rows.length > 0) {
            orden = ordenResult.rows[0];
        }

        res.json({
            success: true,
            flowStatus: paymentStatus,
            orden: orden
        });

    } catch (error) {
        console.error('Error consultando estado:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Error consultando estado del pago'
        });
    }
});

module.exports = router;