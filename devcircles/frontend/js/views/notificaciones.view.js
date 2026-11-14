import { listarNotificaciones, marcarLeida } from '../services/notificaciones.service.js';
import { getUsuario } from '../services/store.js';
import { navegar } from '../router.js';
import { crear, vaciar, avisar, tiempoRelativo } from '../utils/dom.js';
import '../components/shared/empty-state.js';

const ICONOS = { like: '♥', comentario: '💬', seguimiento: '👤' };

export async function montarNotificaciones(contenedor) {
  vaciar(contenedor);

  if (!getUsuario()) {
    avisar('Iniciá sesión para ver tus notificaciones', 'warning');
    navegar('#/login');
    return;
  }

  contenedor.append(crear('h2', { class: 'titulo-vista', text: 'Notificaciones' }));
  const cargando = crear('p', { class: 'cargando', text: 'Cargando...' });
  contenedor.append(cargando);

  let notificaciones;
  try {
    notificaciones = await listarNotificaciones();
  } catch (fallo) {
    cargando.remove();
    contenedor.append(crear('p', { class: 'error-form', text: fallo.message }));
    return;
  }

  cargando.remove();

  if (notificaciones.length === 0) {
    const vacio = document.createElement('empty-state');
    vacio.textContent = 'No tenés notificaciones todavía.';
    contenedor.append(vacio);
    return;
  }

  const lista = crear('ul', { class: 'lista-notis' });

  for (const noti of notificaciones) {
    const marcar = crear('button', {
      class: 'boton-texto',
      type: 'button',
      text: 'Marcar como leída',
    });
    marcar.hidden = Boolean(noti.leido);

    const item = crear('li', { class: noti.leido ? 'noti leida' : 'noti' }, [
      crear('span', { class: 'noti-icono', text: ICONOS[noti.tipo] ?? '•' }),
      crear('div', { class: 'noti-cuerpo' }, [
        crear('p', { class: 'noti-texto', text: noti.mensaje }),
        crear('time', { class: 'noti-fecha', datetime: noti.creado_en, text: tiempoRelativo(noti.creado_en) }),
      ]),
      marcar,
    ]);

    marcar.addEventListener('click', async () => {
      marcar.disabled = true;
      try {
        await marcarLeida(noti.id);
        item.classList.add('leida');
        marcar.hidden = true;
        document.dispatchEvent(new CustomEvent('notificaciones-cambiaron'));
      } catch (fallo) {
        marcar.disabled = false;
        avisar(fallo.message, 'error');
      }
    });

    lista.append(item);
  }

  contenedor.append(lista);
}
