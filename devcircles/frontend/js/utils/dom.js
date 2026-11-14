/**
 * Ayudas chiquitas para no repetir createElement por todos lados.
 */
export function crear(etiqueta, propiedades = {}, hijos = []) {
  const nodo = document.createElement(etiqueta);
  for (const [clave, valor] of Object.entries(propiedades)) {
    if (clave === 'class') nodo.className = valor;
    else if (clave === 'text') nodo.textContent = valor;
    else if (clave.startsWith('on') && typeof valor === 'function') {
      nodo.addEventListener(clave.slice(2).toLowerCase(), valor);
    } else if (valor !== null && valor !== undefined) {
      nodo.setAttribute(clave, valor);
    }
  }
  nodo.append(...[hijos].flat().filter(Boolean));
  return nodo;
}

export function vaciar(nodo) {
  nodo.replaceChildren();
  return nodo;
}

/** Convierte "javascript, node js , react" en ["javascript","node js","react"] */
export function separarEtiquetas(texto) {
  return String(texto)
    .split(',')
    .map((parte) => parte.trim())
    .filter(Boolean)
    .slice(0, 5); // el backend acepta 5 como máximo
}

/** "hace 5 minutos", "ayer", etc. a partir de una fecha ISO */
export function tiempoRelativo(iso) {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '';

  const segundos = Math.round((Date.now() - fecha.getTime()) / 1000);
  const formato = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  const escalas = [
    [60, 'second'],
    [3600, 'minute'],
    [86400, 'hour'],
    [604800, 'day'],
  ];

  let anterior = 1;
  for (const [limite, unidad] of escalas) {
    if (segundos < limite) return formato.format(-Math.round(segundos / anterior), unidad);
    anterior = limite;
  }
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(fecha);
}

/** Muestra un aviso flotante usando el <toast-message> del proyecto */
export function avisar(mensaje, tipo = 'info') {
  const toast = document.createElement('toast-message');
  toast.show(mensaje, { type: tipo });
  return toast;
}

/** Deshace el cambio optimista del <like-button> cuando falla el pedido */
export function revertirLike(boton, detalle) {
  boton.liked = !detalle.liked;
  boton.likes = Math.max(0, detalle.likes + (detalle.liked ? -1 : 1));
}
