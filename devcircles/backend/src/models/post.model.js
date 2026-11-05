const { pool } = require('../config/db');

/**
 * Feed paginado. Acepta filtros opcionales: tipo, etiqueta, orden.
 * Devuelve { posts, total } para armar la meta de paginación en el controller.
 */
const listar = async ({ limite, offset, tipo, etiqueta, orden = 'reciente' }) => {
  const ordenSQL = orden === 'popular' ? 'p.likes_count DESC' : 'p.creado_en DESC';

  // Construye los filtros dinámicamente
  const condiciones = ['p.eliminado = FALSE'];
  const params = [];

  if (tipo) {
    condiciones.push('p.tipo = ?');
    params.push(tipo);
  }
  if (etiqueta) {
    condiciones.push('EXISTS (SELECT 1 FROM post_etiquetas pe JOIN etiquetas e ON pe.etiqueta_id = e.id WHERE pe.post_id = p.id AND e.slug = ?)');
    params.push(etiqueta);
  }

  const where = condiciones.join(' AND ');

  const [posts] = await pool.query(
    `SELECT p.id, p.tipo, p.titulo, p.contenido, p.likes_count, p.comentarios_count, p.creado_en,
            u.id AS autor_id, u.username AS autor_username, u.avatar_url AS autor_avatar
     FROM posts p
     JOIN usuarios u ON p.usuario_id = u.id
     WHERE ${where}
     ORDER BY ${ordenSQL}
     LIMIT ? OFFSET ?`,
    [...params, limite, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM posts p WHERE ${where}`,
    params
  );

  return { posts, total };
};

const buscarPorId = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, u.username AS autor_username, u.avatar_url AS autor_avatar,
            s.lenguaje, s.codigo, s.nombre_archivo
     FROM posts p
     JOIN usuarios u ON p.usuario_id = u.id
     LEFT JOIN snippets s ON s.post_id = p.id
     WHERE p.id = ? AND p.eliminado = FALSE`,
    [id]
  );
  return rows[0] ?? null;
};

const crear = async ({ usuario_id, tipo, titulo, contenido }) => {
  const [result] = await pool.query(
    'INSERT INTO posts (usuario_id, tipo, titulo, contenido) VALUES (?, ?, ?, ?)',
    [usuario_id, tipo, titulo ?? null, contenido]
  );
  return result.insertId;
};

const actualizar = async (id, campos) => {
  const permitidos = ['titulo', 'contenido'];
  const entradas = Object.entries(campos).filter(([k]) => permitidos.includes(k));
  if (entradas.length === 0) return;

  const sets = entradas.map(([k]) => `${k} = ?`).join(', ');
  const valores = entradas.map(([, v]) => v);
  await pool.query(`UPDATE posts SET ${sets} WHERE id = ?`, [...valores, id]);
};

// Borrado lógico
const eliminar = async (id) => {
  await pool.query('UPDATE posts SET eliminado = TRUE WHERE id = ?', [id]);
};

const esAutor = async (postId, usuarioId) => {
  const [[row]] = await pool.query(
    'SELECT usuario_id FROM posts WHERE id = ? LIMIT 1',
    [postId]
  );
  return row?.usuario_id === usuarioId;
};

module.exports = { listar, buscarPorId, crear, actualizar, eliminar, esAutor };
