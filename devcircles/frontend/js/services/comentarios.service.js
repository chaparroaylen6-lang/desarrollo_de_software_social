import { api } from './api.js';

export async function listarComentarios(postId) {
  const { data } = await api(`/posts/${postId}/comentarios`);
  return data;
}

export async function crearComentario(postId, contenido) {
  const { data } = await api(`/posts/${postId}/comentarios`, {
    method: 'POST',
    body: { contenido },
  });
  return data;
}

export async function eliminarComentario(id) {
  return api(`/comentarios/${id}`, { method: 'DELETE' });
}
