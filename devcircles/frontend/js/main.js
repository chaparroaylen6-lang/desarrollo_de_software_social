import './components/core/app-shell.js';
import './components/core/modal-dialog.js';
import './components/core/toast-message.js';
import './components/core/nav-principal.js';

import { restaurarSesion, cerrarSesion } from './services/auth.service.js';
import { suscribir, getUsuario } from './services/store.js';
import { contarNoLeidas } from './services/notificaciones.service.js';
import { listarEtiquetas } from './services/posts.service.js';
import { registrar, iniciar, navegar } from './router.js';
import { montarFeed } from './views/feed.view.js';
import { montarLogin } from './views/login.view.js';
import { montarDetalle } from './views/detalle.view.js';
import { montarNotificaciones } from './views/notificaciones.view.js';
import { crear, avisar } from './utils/dom.js';

const salida = document.querySelector('#app');
const nav = document.querySelector('nav-principal');

// La barra de navegación se entera sola de quién está logueado
suscribir((usuario) => {
  nav.usuario = usuario;
  actualizarPendientes();
});

async function actualizarPendientes() {
  nav.pendientes = getUsuario() ? await contarNoLeidas() : 0;
}

document.addEventListener('notificaciones-cambiaron', actualizarPendientes);

nav.addEventListener('cerrar-sesion', () => {
  cerrarSesion();
  avisar('Sesión cerrada');
  navegar('#/feed');
});

registrar('#/feed', () => montarFeed(salida));
registrar('#/etiqueta/:slug', ({ slug }) => montarFeed(salida, { etiqueta: slug }));
registrar('#/login', () => montarLogin(salida));
registrar('#/post/:id', (params) => montarDetalle(salida, params));
registrar('#/notificaciones', () => montarNotificaciones(salida));

async function cargarEtiquetas() {
  const contenedor = document.querySelector('#etiquetas');
  if (!contenedor) return;

  try {
    const etiquetas = await listarEtiquetas();
    contenedor.replaceChildren();

    if (etiquetas.length === 0) {
      contenedor.append(crear('p', { class: 'lateral-vacio', text: 'Todavía no hay etiquetas.' }));
      return;
    }

    for (const etiqueta of etiquetas) {
      contenedor.append(crear('a', {
        class: 'etiqueta-link',
        href: `#/etiqueta/${etiqueta.slug}`,
        text: `#${etiqueta.nombre}`,
      }));
    }
  } catch {
    contenedor.replaceChildren(
      crear('p', { class: 'lateral-vacio', text: 'No se pudieron cargar las etiquetas.' })
    );
  }
}

// Primero recuperamos la sesión guardada, recién después arranca el router:
// así la primera vista ya sabe si hay alguien logueado.
restaurarSesion().finally(() => {
  iniciar({ porDefecto: '#/feed' });
  cargarEtiquetas();
});
