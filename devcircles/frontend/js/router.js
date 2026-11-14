// Router mínimo basado en el hash de la URL (#/feed, #/post/3, ...).
// No necesita servidor ni configuración: funciona con Live Server tal cual.
const rutas = [];
let porDefecto = '#/feed';

function partir(ruta) {
  return String(ruta).replace(/^#/, '').split('/').filter(Boolean);
}

export function registrar(patron, manejar) {
  rutas.push({ partes: partir(patron), manejar });
}

function resolver(hash) {
  const partes = partir(hash);

  for (const ruta of rutas) {
    if (ruta.partes.length !== partes.length) continue;

    const params = {};
    let coincide = true;

    for (let i = 0; i < partes.length; i += 1) {
      const esperado = ruta.partes[i];
      if (esperado.startsWith(':')) {
        params[esperado.slice(1)] = decodeURIComponent(partes[i]);
      } else if (esperado !== partes[i]) {
        coincide = false;
        break;
      }
    }

    if (coincide) return { ruta, params };
  }

  return null;
}

function alCambiar() {
  const encontrada = resolver(window.location.hash || porDefecto);
  if (encontrada) {
    encontrada.ruta.manejar(encontrada.params);
  } else {
    window.location.hash = porDefecto;
  }
}

export function navegar(hash) {
  if (window.location.hash === hash) alCambiar();
  else window.location.hash = hash;
}

export function recargar() {
  alCambiar();
}

export function iniciar(opciones = {}) {
  porDefecto = opciones.porDefecto ?? porDefecto;
  window.addEventListener('hashchange', alCambiar);

  if (!window.location.hash) window.location.hash = porDefecto;
  else alCambiar();
}
