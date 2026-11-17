const mysql = require('mysql2/promise');
const config = require('./env');

// Pool compartido por toda la aplicación. Una sola instancia, nunca
// crear pools por request: se agotan las conexiones bajo carga.
const pool = mysql.createPool({
  host:            config.db.host,
  port:            config.db.port,
  user:            config.db.user,
  password:        config.db.password,
  database:        config.db.database,
  connectionLimit: config.db.connectionLimit,
  waitForConnections: true,
  queueLimit: 0,            // cola ilimitada
  timezone: 'local',            // fechas en UTC, siempre
  decimalNumbers: true,     // evita strings en columnas DECIMAL
});

/**
 * Verifica la conexión al arrancar el servidor.
 * Lanza si MySQL no responde para que el proceso no quede zombi.
 */
async function verificarConexion() {
  const conn = await pool.getConnection();
  conn.release();
  console.log('[db] ✅ Conexión a MySQL establecida');
}

module.exports = { pool, verificarConexion };
