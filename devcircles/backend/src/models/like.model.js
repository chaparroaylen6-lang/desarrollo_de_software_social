const { pool } = require('../config/db');

const existe = async (usuarioId, postId) => {
  const [rows] = await pool.query(
    'SELECT * FROM likes WHERE usuario_id = ? AND post_id = ?',
    [usuarioId, postId]
  );
  return rows.length > 0;
};

const crear = async (usuarioId, postId) => {
  await pool.query(
    'INSERT INTO likes (usuario_id, post_id) VALUES (?, ?)',
    [usuarioId, postId]
  );
  await pool.query(
    'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
    [postId]
  );
};

const eliminar = async (usuarioId, postId) => {
  await pool.query(
    'DELETE FROM likes WHERE usuario_id = ? AND post_id = ?',
    [usuarioId, postId]
  );
  await pool.query(
    'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
    [postId]
  );
};

module.exports = { existe, crear, eliminar };