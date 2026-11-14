const { pool } = require('../config/db');
const etiquetaModel = require('./etiqueta.model');

/**
 * Feed paginado. Acepta filtros opcionales: tipo, etiqueta, orden.
 * Si se pasa usuarioId, cada post indica si ese usuario ya le dio like.
 * Devuelve { posts, total } para armar la meta de paginación en el controller.
 */
const listar = async ({ limite, offset, tipo, etiqueta, orden = 'reciente', usuarioId = null }) => {
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

  // Sin usuario logueado no hay nada que marcar: la columna sale siempre en falso
  const likedSQL = usuarioId
    ? 'EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.usuario_id = ?)'
    : 'FALSE';
  const likedParams = usuarioId ? [usuarioId] : [];

  const [posts] = await pool.query(
    `SELECT p.id, p.tipo, p.titulo, p.contenido, p.likes_count, p.comentarios_count, p.creado_en,
            u.id AS autor_id, u.username AS autor_username, u.avatar_url AS autor_avatar,
            s.lenguaje, s.codigo, s.nombre_archivo,
            ${likedSQL} AS liked
     FROM posts p
     JOIN usuarios u ON p.usuario_id = u.id
     LEFT JOIN snippets s ON s.post_id = p.id
     WHERE ${where}
     ORDER BY ${ordenSQL}
     LIMIT ? OFFSET ?`,
    [...likedParams, ...params, limite, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM posts p WHERE ${where}`,
    params
  );

  // Las etiquetas de todos los posts, en una sola consulta extra
  const etiquetasPorPost = await etiquetaModel.listarPorPosts(posts.map((p) => p.id));
  for (const post of posts) {
    post.etiquetas = etiquetasPorPost.get(post.id) ?? [];
    post.liked = Boolean(post.liked);
  }

  return { posts, total };
};

const buscarPorId = async (id, usuarioId = null) => {
  const likedSQL = usuarioId
    ? 'EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.usuario_id = ?)'
    : 'FALSE';
  const likedParams = usuarioId ? [usuarioId] : [];

  const [rows] = await pool.query(
    `SELECT p.*, u.username AS autor_username, u.avatar_url AS autor_avatar,
            s.lenguaje, s.codigo, s.nombre_archivo,
            ${likedSQL} AS liked
     FROM posts p
     JOIN usuarios u ON p.usuario_id = u.id
     LEFT JOIN snippets s ON s.post_id = p.id
     WHERE p.id = ? AND p.eliminado = FALSE`,
    [...likedParams, id]
  );

  const post = rows[0] ?? null;
  if (post) {
    const etiquetasPorPost = await etiquetaModel.listarPorPosts([post.id]);
    post.etiquetas = etiquetasPorPost.get(post.id) ?? [];
    post.liked = Boolean(post.liked);
  }
  return post;
};

const crear = async ({ usuario_id, tipo, titulo, contenido, etiquetas, lenguaje, codigo, nombre_archivo }) => {
  const [result] = await pool.query(
    'INSERT INTO posts (usuario_id, tipo, titulo, contenido) VALUES (?, ?, ?, ?)',
    [usuario_id, tipo, titulo ?? null, contenido]
  );
  const postId = result.insertId;

  // Los posts de tipo snippet guardan su código en su propia tabla
  if (tipo === 'snippet' && codigo) {
    await pool.query(
      'INSERT INTO snippets (post_id, lenguaje, codigo, nombre_archivo) VALUES (?, ?, ?, ?)',
      [postId, lenguaje ?? null, codigo, nombre_archivo ?? null]
    );
  }

  if (Array.isArray(etiquetas) && etiquetas.length > 0) {
    await etiquetaModel.asignarAPost(postId, etiquetas);
  }

  return postId;
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
