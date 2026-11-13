const { pool } = require('../config/db');

const listarPorPost = async (postId) => {
  const [rows] = await pool.query(
    `SELECT id, post_id AS postId, usuario_id AS usuarioId, contenido, creado_en
     FROM comentarios
     WHERE post_id = ?
     ORDER BY creado_en ASC`,
    [postId]
  );
  return rows;
};

const buscarPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, post_id AS postId, usuario_id AS usuarioId, contenido, creado_en
     FROM comentarios
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
};

const crear = async ({ postId, usuarioId, contenido }) => {
  const [result] = await pool.query(
    'INSERT INTO comentarios (post_id, usuario_id, contenido) VALUES (?, ?, ?)',
    [postId, usuarioId, contenido]
  );
  await pool.query(
    'UPDATE posts SET comentarios_count = comentarios_count + 1 WHERE id = ?',
    [postId]
  );
  return result.insertId;
};

const eliminar = async (id) => {
  const comentario = await buscarPorId(id);
  if (!comentario) return;
  await pool.query('DELETE FROM comentarios WHERE id = ?', [id]);
  await pool.query(
    'UPDATE posts SET comentarios_count = comentarios_count - 1 WHERE id = ?',
    [comentario.postId]
  );
};

module.exports = { listarPorPost, buscarPorId, crear, eliminar };