import { obtenerPost } from '../services/posts.service.js';
import { listarComentarios, crearComentario } from '../services/comentarios.service.js';
import { alternarLike } from '../services/likes.service.js';
import { getUsuario } from '../services/store.js';
import { crear, vaciar, avisar, revertirLike } from '../utils/dom.js';
import '../components/posts/post-card.js';
import '../components/comments/comment-thread.js';

export async function montarDetalle(contenedor, { id }) {
  vaciar(contenedor);
  contenedor.append(crear('a', { class: 'volver', href: '#/feed', text: '← Volver al feed' }));

  const cargando = crear('p', { class: 'cargando', text: 'Cargando post...' });
  contenedor.append(cargando);

  let post;
  try {
    post = await obtenerPost(id);
  } catch (fallo) {
    cargando.remove();
    contenedor.append(crear('p', { class: 'error-form', text: `No se pudo abrir el post: ${fallo.message}` }));
    return;
  }

  cargando.remove();

  const card = document.createElement('post-card');
  customElements.upgrade(card);
  card.post = post;
  contenedor.append(card);

  card.addEventListener('like-toggle', async (evento) => {
    // composedPath()[0] es el <like-button>; evento.target sería <post-card>
    const boton = evento.composedPath()[0];
    const detalle = evento.detail;

    if (!getUsuario()) {
      revertirLike(boton, detalle);
      avisar('Iniciá sesión para dar like', 'warning');
      return;
    }

    try {
      const respuesta = await alternarLike(detalle.postId);
      boton.liked = respuesta.liked;
    } catch (fallo) {
      revertirLike(boton, detalle);
      avisar(fallo.message, 'error');
    }
  });

  const hilo = document.createElement('comment-thread');
  hilo.puedeComentar = Boolean(getUsuario());
  contenedor.append(hilo);

  try {
    hilo.comentarios = await listarComentarios(id);
  } catch (fallo) {
    avisar(`No se pudieron cargar los comentarios: ${fallo.message}`, 'error');
  }

  hilo.addEventListener('comentario-submit', async (evento) => {
    try {
      const nuevo = await crearComentario(id, evento.detail.contenido);
      hilo.comentarios = [...hilo.comentarios, nuevo];
      avisar('Comentario publicado', 'success');
    } catch (fallo) {
      avisar(fallo.message, 'error');
    }
  });
}
