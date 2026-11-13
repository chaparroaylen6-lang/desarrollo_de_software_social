const { pool } = require('../config/db');

const crear = async ({ usuario_id, post_id, comentario_id, razon }) => {
  const [result] = await pool.query(
    'INSERT INTO reportes (usuario_id, post_id, comentario_id, razon) VALUES (?, ?, ?, ?)',
    [usuario_id, post_id, comentario_id, razon]
  );
  return result.insertId;
};

module.exports = { crear };