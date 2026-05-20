const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  // Accept either DB_* env vars (used locally) or Railway-provided MYSQL* vars
  host:     process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
  port:     parseInt(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT) || 3306,
  user:     process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'voldigital',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',

});

// Debug: show which client we're using and whether DATABASE_URL exists (no secrets printed)
console.log('DB config:', 'DB_CLIENT=', DB_CLIENT || '<unset>', 'DATABASE_URL set=', !!process.env.DATABASE_URL);
pool.getConnection()
  .then(conn => {
    console.log('MySQL conectado correctamente');
    conn.release();
  })
  .catch(err => {
    console.error('Error al conectar MySQL:', err.message);
  });

module.exports = pool;
