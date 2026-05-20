const mysql = require('mysql2/promise');
require('dotenv').config();

// If Railway provides a single MYSQL URL (or public URL), parse it into DB_* fallbacks.
const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.MYSQLPUBLICURL;
if (mysqlUrl && !process.env.DB_HOST) {
  try {
    const parsed = new URL(mysqlUrl);
    // set fallback env vars so the existing mysql pool code picks them up
    process.env.DB_HOST = parsed.hostname;
    if (parsed.port) process.env.DB_PORT = parsed.port;
    if (parsed.username) process.env.DB_USER = parsed.username;
    if (parsed.password) process.env.DB_PASSWORD = parsed.password;
    if (parsed.pathname) process.env.DB_NAME = parsed.pathname.replace(/^\//, '');
    console.log('Parsed MYSQL URL into DB_HOST/DB_USER/DB_NAME');
  } catch (err) {
    console.log('Could not parse MYSQL URL from env:', err.message);
  }
}

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

// Show resolved DB params (hide password) to help debug connection issues
console.log('MySQL params:', {
  host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
  port: process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'voldigital',
  passwordSet: !!(process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD)
});

// Debug: show which client we're using and whether DATABASE_URL exists (no secrets printed)
console.log('DB config:', 'DB_CLIENT=', process.env.DB_CLIENT || '<unset>', 'DATABASE_URL set=', !!process.env.DATABASE_URL);
pool.getConnection()
  .then(conn => {
    console.log('MySQL conectado correctamente');
    conn.release();
  })
  .catch(err => {
    // Log full error stack to help debug connection issues in hosted logs
    console.error('Error al conectar MySQL:', err && err.stack ? err.stack : err);
  });

module.exports = pool;
