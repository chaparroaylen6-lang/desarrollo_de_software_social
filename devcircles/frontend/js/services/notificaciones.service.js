import { api } from './api.js';

export async function listarNotificaciones() {
  const { data } = await api('/notificaciones');
  return data;
}

export async function marcarLeida(id) {
  return api(`/notificaciones/${id}/leer`, { method: 'PATCH' });
}

export async function contarNoLeidas() {
  try {
    const notificaciones = await listarNotificaciones();
    return notificaciones.filter((n) => !n.leido).length;
  } catch {
    return 0; // Sin sesión o sin red: no mostramos contador
  }
}
