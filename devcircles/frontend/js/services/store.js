// Estado compartido mínimo: quién está logueado ahora mismo.
// Los componentes se suscriben y se enteran solos cuando cambia.
const estado = { usuario: null };
const suscriptores = new Set();

export function getUsuario() {
  return estado.usuario;
}

export function setUsuario(usuario) {
  estado.usuario = usuario;
  for (const avisar of suscriptores) avisar(estado.usuario);
}

export function suscribir(avisar) {
  suscriptores.add(avisar);
  avisar(estado.usuario); // le damos el estado actual de entrada
  return () => suscriptores.delete(avisar);
}
