const { pool } = require('../config/db');
const { slugify } = require('../utils/slug');

const listarTodas = async () => {
  const [rows] = await pool.query('SELECT id, nombre, slug FROM etiquetas ORDER BY nombre');
  return rows;
};

/**
 * Devuelve el id de la etiqueta con ese nombre; si no existe, la crea.
 * Así dos posts que usan "JavaScript" comparten la misma fila.
 */
const obtenerOCrear = async (nombre) => {
  const slug = slugify(nombre);
  if (!slug) return null;

  const [existentes] = await pool.query('SELECT id FROM etiquetas WHERE slug = ? LIMIT 1', [slug]);
  if (existentes.length > 0) return existentes[0].id;

  const [result] = await pool.query(
    'INSERT INTO etiquetas (nombre, slug) VALUES (?, ?)',
    [String(nombre).trim(), slug]
  );
  return result.insertId;
};

const asignarAPost = async (postId, nombres = []) => {
  for (const nombre of nombres) {
    const etiquetaId = await obtenerOCrear(nombre);
    if (!etiquetaId) continue;
    await pool.query(
      'INSERT IGNORE INTO post_etiquetas (post_id, etiqueta_id) VALUES (?, ?)',
      [postId, etiquetaId]
    );
  }
};

/**
 * Trae las etiquetas de varios posts en una sola consulta,
 * para no hacer una consulta por post al armar el feed.
 */
const listarPorPosts = async (postIds = []) => {
  if (postIds.length === 0) return new Map();

  const huecos = postIds.map(() => '?').join(', ');
  const [rows] = await pool.query(
    `SELECT pe.post_id, e.id, e.nombre, e.slug
     FROM post_etiquetas pe
     JOIN etiquetas e ON e.id = pe.etiqueta_id
     WHERE pe.post_id IN (${huecos})
     ORDER BY e.nombre`,
    postIds
  );

  const porPost = new Map();
  for (const row of rows) {
    const lista = porPost.get(row.post_id) ?? [];
    lista.push({ id: row.id, nombre: row.nombre, slug: row.slug });
    porPost.set(row.post_id, lista);
  }
  return porPost;
};

module.exports = { listarTodas, obtenerOCrear, asignarAPost, listarPorPosts };
