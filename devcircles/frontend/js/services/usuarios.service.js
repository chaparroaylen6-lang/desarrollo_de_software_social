import { api } from './api.js';

export async function obtenerPerfilPropio() {
  const { data } = await api('/usuarios/yo');
  return data;
}

export async function obtenerPerfil(username) {
  const { data } = await api(`/usuarios/${username}`);
  return data;
}

export async function actualizarPerfil(campos) {
  const { data } = await api('/usuarios/yo', { method: 'PATCH', body: campos });
  return data;
}

export async function alternarSeguir(usuarioId) {
  return api(`/usuarios/${usuarioId}/seguimiento`, { method: 'POST' });
}
