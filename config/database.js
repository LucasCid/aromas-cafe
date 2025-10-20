const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ... resto del código igual
// Evento para manejar errores de conexión
pool.on('error', (err, client) => {
    console.error('Error inesperado en cliente de base de datos', err);
    process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release();
    } catch (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
        console.error('Verifica que PostgreSQL esté corriendo y la configuración sea correcta');
    }
};

// Probar conexión al iniciar
testConnection();

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params)
};