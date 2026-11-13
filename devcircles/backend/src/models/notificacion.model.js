const { pool } = require('../config/db');

const listarPorUsuario = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT id, tipo, mensaje, leido, creado_en
     FROM notificaciones
     WHERE usuario_id = ?
     ORDER BY creado_en DESC`,
    [usuarioId]
  );
  return rows;
};

const marcarLeida = async (id, usuarioId) => {
  await pool.query(
    'UPDATE notificaciones SET leido = TRUE WHERE id = ? AND usuario_id = ?',
    [id, usuarioId]
  );
};

const crear = async ({ usuarioId, tipo, mensaje }) => {
  await pool.query(
    'INSERT INTO notificaciones (usuario_id, tipo, mensaje) VALUES (?, ?, ?)',
    [usuarioId, tipo, mensaje]
  );
};

module.exports = { listarPorUsuario, marcarLeida, crear };