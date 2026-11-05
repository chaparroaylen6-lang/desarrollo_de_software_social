const { pool } = require('../config/db');

const buscarPorEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE LIMIT 1',
    [email]
  );
  return rows[0] ?? null;
};

const buscarPorId = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, username, email, nombre_mostrado, bio, avatar_url, rol, reputacion, creado_en FROM usuarios WHERE id = ? AND activo = TRUE LIMIT 1',
    [id]
  );
  return rows[0] ?? null;
};

const buscarPorUsername = async (username) => {
  const [rows] = await pool.query(
    'SELECT id, username, nombre_mostrado, bio, avatar_url, rol, reputacion, creado_en FROM usuarios WHERE username = ? AND activo = TRUE LIMIT 1',
    [username]
  );
  return rows[0] ?? null;
};

const crear = async ({ username, email, password_hash, nombre_mostrado }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (username, email, password_hash, nombre_mostrado) VALUES (?, ?, ?, ?)',
    [username, email, password_hash, nombre_mostrado ?? username]
  );
  return result.insertId;
};

const actualizar = async (id, campos) => {
  // Solo actualiza los campos que se envíen
  const permitidos = ['nombre_mostrado', 'bio', 'avatar_url'];
  const entradas = Object.entries(campos).filter(([k]) => permitidos.includes(k));
  if (entradas.length === 0) return;

  const sets = entradas.map(([k]) => `${k} = ?`).join(', ');
  const valores = entradas.map(([, v]) => v);
  await pool.query(`UPDATE usuarios SET ${sets} WHERE id = ?`, [...valores, id]);
};

module.exports = { buscarPorEmail, buscarPorId, buscarPorUsername, crear, actualizar };
