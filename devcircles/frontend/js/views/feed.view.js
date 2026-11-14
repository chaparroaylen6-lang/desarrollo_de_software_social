import { listarPosts, crearPost } from '../services/posts.service.js';
import { alternarLike } from '../services/likes.service.js';
import { getUsuario } from '../services/store.js';
import { crear, vaciar, avisar, revertirLike } from '../utils/dom.js';
import '../components/posts/post-card.js';
import '../components/posts/post-form.js';
import '../components/shared/empty-state.js';

/** Arma la tarjeta de un post más la fila con el enlace a sus comentarios */
function tarjetaDePost(post) {
  const card = document.createElement('post-card');
  customElements.upgrade(card); // despierta el <like-button> de adentro antes de pasarle datos
  card.post = post;

  const comentarios = crear('a', {
    class: 'link-comentarios',
    href: `#/post/${post.id}`,
    text: post.comentarios === 1 ? '1 comentario' : `${post.comentarios ?? 0} comentarios`,
  });

  return crear('div', { class: 'post' }, [card, crear('div', { class: 'post-pie' }, [comentarios])]);
}

export async function montarFeed(contenedor, { etiqueta } = {}) {
  vaciar(contenedor);
  const usuario = getUsuario();

  if (etiqueta) {
    contenedor.append(crear('p', { class: 'filtro-activo' }, [
      document.createTextNode(`Filtrando por #${etiqueta} · `),
      crear('a', { href: '#/feed', text: 'ver todo' }),
    ]));
  }

  if (usuario) {
    const form = document.createElement('post-form');
    form.addEventListener('post-submit', async (evento) => {
      form.enviando = true;
      try {
        const nuevo = await crearPost(evento.detail);
        form.limpiar();
        lista.prepend(tarjetaDePost(nuevo));
        vacio.hidden = true;
        avisar('Post publicado', 'success');
      } catch (fallo) {
        form.error = fallo.message;
      } finally {
        form.enviando = false;
      }
    });
    contenedor.append(form);
  } else {
    contenedor.append(crear('p', { class: 'aviso-sesion' }, [
      crear('a', { href: '#/login', text: 'Iniciá sesión' }),
      document.createTextNode(' para publicar, comentar o dar like.'),
    ]));
  }

  const lista = crear('div', { class: 'lista-posts' });
  const vacio = document.createElement('empty-state');
  vacio.textContent = 'Todavía no hay posts. ¡Publicá el primero!';
  vacio.hidden = true;
  const cargando = crear('p', { class: 'cargando', text: 'Cargando posts...' });

  contenedor.append(cargando, lista, vacio);

  // Un solo listener para todos los botones de like: el evento burbujea
  lista.addEventListener('like-toggle', async (evento) => {
    // El evento cruza el Shadow DOM, así que evento.target apunta a <post-card>.
    // composedPath()[0] nos devuelve el <like-button> real que lo disparó.
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

  try {
    const posts = await listarPosts({ etiqueta });
    cargando.remove();

    if (posts.length === 0) {
      vacio.hidden = false;
      return;
    }

    for (const post of posts) lista.append(tarjetaDePost(post));
  } catch (fallo) {
    cargando.remove();
    contenedor.append(crear('p', { class: 'error-form', text: `No se pudo cargar el feed: ${fallo.message}` }));
  }
}
