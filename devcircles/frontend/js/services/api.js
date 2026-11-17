// Único lugar donde se define a dónde apunta el frontend.
const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://TU-BACKEND.up.railway.app/api';
const TOKEN_KEY = 'devcircles_token';

export function guardarToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Modo privado del navegador: seguimos sin guardar.
  }
}

export function leerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function borrarToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nada que borrar.
  }
}

export async function api(ruta, opciones = {}) {
  const headers = { ...opciones.headers };
  if (opciones.body) headers['Content-Type'] = 'application/json';

  const token = leerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    ...opciones,
    headers,
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  });

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new Error(datos?.error ?? `Error ${respuesta.status}`);
  return datos;
}
