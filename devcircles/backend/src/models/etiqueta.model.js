const { pool } = require('../config/db');

const listarTodas = async () => {
  const [rows] = await pool.query('SELECT id, nombre, slug FROM etiquetas ORDER BY nombre');
  return rows;
};

module.exports = { listarTodas };