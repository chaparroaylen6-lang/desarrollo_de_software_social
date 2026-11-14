import { api, guardarToken, borrarToken, leerToken } from './api.js';
import { setUsuario } from './store.js';

export async function registrar({ username, email, password, nombre_mostrado }) {
  const datos = await api('/auth/registro', {
    method: 'POST',
    body: { username, email, password, nombre_mostrado: nombre_mostrado || undefined },
  });
  guardarToken(datos.token);
  return restaurarSesion();
}

export async function iniciarSesion({ email, password }) {
  const datos = await api('/auth/login', { method: 'POST', body: { email, password } });
  guardarToken(datos.token);
  return restaurarSesion();
}

export function cerrarSesion() {
  borrarToken();
  setUsuario(null);
}

/**
 * Al abrir la página, si quedó un token guardado, lo usamos para recuperar
 * los datos del usuario. Si el token venció, lo borramos y seguimos como visitante.
 */
export async function restaurarSesion() {
  if (!leerToken()) {
    setUsuario(null);
    return null;
  }

  try {
    const { data } = await api('/usuarios/yo');
    setUsuario(data);
    return data;
  } catch {
    borrarToken();
    setUsuario(null);
    return null;
  }
}
