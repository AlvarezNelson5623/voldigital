require('dotenv').config();

// This file supports both MySQL (mysql2) and Postgres (pg).
// If `DATABASE_URL` is present or `DB_CLIENT=pg`, Postgres will be used (for Supabase).

const DB_CLIENT = (process.env.DB_CLIENT || '').toLowerCase();

if (DB_CLIENT === 'pg' || process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const connectionString = process.env.DATABASE_URL || (
    process.env.DB_HOST
      ? `postgresql://${process.env.DB_USER || 'postgres'}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'voldigital'}`
      : null
  );

  const pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL === 'true' || !!process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    max: 10,
  });

  pool.connect()
    .then(client => client.query('SELECT 1')
      .then(() => {
        console.log('✅ Postgres conectado correctamente');
        client.release();
      })
      .catch(err => {
        client.release();
        console.error('❌ Error en consulta de verificación Postgres:', err.message);
      })
    )
    .catch(err => console.error('❌ Error al conectar Postgres:', err.message));

  module.exports = pool;

} else {
  const mysql = require('mysql2/promise');

  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'voldigital',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    charset:            'utf8mb4',
  });

  pool.getConnection()
    .then(conn => {
      console.log('✅ MySQL conectado correctamente');
      conn.release();
    })
    .catch(err => {
      console.error('❌ Error al conectar MySQL:', err.message);
    });

  module.exports = pool;
}
