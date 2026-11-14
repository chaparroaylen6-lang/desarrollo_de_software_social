import { api } from './api.js';

// Traduce un post como lo devuelve la API al formato que espera <post-card>.
function adaptarPost(post) {
  return {
    id: post.id,
    username: post.autor_username,
    avatar: post.autor_avatar,
    titulo: post.titulo,
    contenido: post.contenido,
    tipo: post.tipo,
    codigo: post.codigo,
    lenguaje: post.lenguaje,
    nombre_archivo: post.nombre_archivo,
    likes: post.likes_count,
    liked: post.liked,
    comentarios: post.comentarios_count,
    createdAt: post.creado_en,
    tags: post.etiquetas ?? [],
  };
}

export async function listarPosts({ etiqueta, tipo, orden } = {}) {
  const query = new URLSearchParams();
  if (etiqueta) query.set('etiqueta', etiqueta);
  if (tipo) query.set('tipo', tipo);
  if (orden) query.set('orden', orden);

  const sufijo = query.toString() ? `?${query}` : '';
  const { data } = await api(`/posts${sufijo}`);
  return data.map(adaptarPost);
}

export async function obtenerPost(id) {
  const { data } = await api(`/posts/${id}`);
  return adaptarPost(data);
}

export async function crearPost({ tipo, titulo, contenido, etiquetas, lenguaje, codigo, nombre_archivo }) {
  // Mandamos solo los campos con valor: los vacíos los rechaza el validador.
  const body = { tipo, contenido };
  if (titulo) body.titulo = titulo;
  if (etiquetas?.length) body.etiquetas = etiquetas;
  if (tipo === 'snippet') {
    if (lenguaje) body.lenguaje = lenguaje;
    if (codigo) body.codigo = codigo;
    if (nombre_archivo) body.nombre_archivo = nombre_archivo;
  }

  const { data } = await api('/posts', { method: 'POST', body });
  return adaptarPost(data);
}

export async function listarEtiquetas() {
  const { data } = await api('/etiquetas');
  return data;
}
