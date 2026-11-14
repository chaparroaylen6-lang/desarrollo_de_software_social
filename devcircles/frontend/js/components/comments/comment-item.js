import { BaseComponent } from '../base-component.js';
import '../users/user-avatar.js';

export class CommentItem extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      article { display: flex; gap: var(--space-3, 0.75rem); padding: var(--space-3, 0.75rem) 0; }
      article + article { border-top: 1px solid var(--border-color, #dbe3ee); }
      .cuerpo { display: grid; gap: 0.15rem; }
      .encabezado { display: flex; align-items: baseline; gap: var(--space-2, 0.5rem); }
      .username { color: var(--text-color, #172033); font-weight: 650; font-size: 0.9rem; }
      time { color: var(--muted-color, #64748b); font-size: 0.75rem; }
      p { margin: 0; color: var(--text-color, #172033); overflow-wrap: anywhere; white-space: pre-wrap; }
    </style>
    <article>
      <user-avatar></user-avatar>
      <div class="cuerpo">
        <div class="encabezado">
          <span class="username"></span>
          <time></time>
        </div>
        <p class="contenido"></p>
      </div>
    </article>
  `;

  constructor() {
    super();
    this._comentario = null;
  }

  connectedCallback() {
    this.render();
  }

  set comentario(valor) {
    this._comentario = valor;
    this.render();
  }

  get comentario() {
    return this._comentario;
  }

  render() {
    if (!this.isConnected) return;
    const comentario = this._comentario ?? {};
    const username = comentario.autor_username ?? 'Usuario';

    const avatar = this.shadowRoot.querySelector('user-avatar');
    avatar.setAttribute('username', username);
    if (comentario.autor_avatar) avatar.setAttribute('src', comentario.autor_avatar);
    else avatar.removeAttribute('src');

    this.shadowRoot.querySelector('.username').textContent = username;
    this.shadowRoot.querySelector('.contenido').textContent = comentario.contenido ?? '';

    const time = this.shadowRoot.querySelector('time');
    const fecha = new Date(comentario.creado_en);
    if (!Number.isNaN(fecha.getTime())) {
      time.dateTime = fecha.toISOString();
      time.textContent = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(fecha);
    } else {
      time.removeAttribute('datetime');
      time.textContent = '';
    }
  }
}

if (!customElements.get('comment-item')) {
  customElements.define('comment-item', CommentItem);
}
