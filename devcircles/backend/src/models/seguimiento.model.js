const { pool } = require('../config/db');

const existe = async (seguidorId, seguidoId) => {
  const [rows] = await pool.query(
    'SELECT * FROM seguimiento WHERE seguidor_id = ? AND seguido_id = ?',
    [seguidorId, seguidoId]
  );
  return rows.length > 0;
};

const crear = async (seguidorId, seguidoId) => {
  await pool.query(
    'INSERT INTO seguimiento (seguidor_id, seguido_id) VALUES (?, ?)',
    [seguidorId, seguidoId]
  );
};

const eliminar = async (seguidorId, seguidoId) => {
  await pool.query(
    'DELETE FROM seguimiento WHERE seguidor_id = ? AND seguido_id = ?',
    [seguidorId, seguidoId]
  );
};

module.exports = { existe, crear, eliminar };