import { BaseComponent } from '../base-component.js';
import './user-badge.js';

export class UserAvatar extends BaseComponent {
  static observedAttributes = ['src', 'username', 'rol'];

  static template = `
    <style>
      :host {
        display: inline-flex;
        position: relative;
        width: 2.75rem;
        height: 2.75rem;
        flex: 0 0 auto;
      }
      .avatar, .fallback {
        display: grid;
        width: 100%;
        height: 100%;
        place-items: center;
        overflow: hidden;
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-full, 9999px);
        color: var(--text-color, #172033);
        background: var(--surface-subtle-color, #f1f5f9);
        font: 600 1rem/1 var(--font-family, sans-serif);
      }
      .avatar { object-fit: cover; }
      /* display:grid de la regla de arriba le gana al atributo hidden:
         sin esto, la imagen rota sigue ocupando lugar y muestra su texto alt */
      .avatar[hidden], .fallback[hidden] { display: none; }
      user-badge {
        position: absolute;
        right: -0.5rem;
        bottom: -0.2rem;
      }
    </style>
    <img class="avatar" alt="" hidden>
    <span class="fallback" aria-hidden="true"></span>
    <user-badge hidden></user-badge>
  `;

  connectedCallback() {
    this.update();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }

  update() {
    const image = this.shadowRoot.querySelector('.avatar');
    const fallback = this.shadowRoot.querySelector('.fallback');
    const badge = this.shadowRoot.querySelector('user-badge');
    const username = this.getAttribute('username')?.trim() || 'Usuario';
    const source = this.getAttribute('src')?.trim();

    image.alt = `Avatar de ${username}`;
    image.onerror = () => {
      image.hidden = true;
      fallback.hidden = false;
    };

    if (source && this.isAllowedImageSource(source)) {
      image.src = source;
      image.hidden = false;
      fallback.hidden = true;
    } else {
      image.removeAttribute('src');
      image.hidden = true;
      fallback.hidden = false;
    }

    fallback.textContent = Array.from(username)[0]?.toLocaleUpperCase() || '?';

    const role = this.getAttribute('rol')?.toLowerCase();
    if (role === 'admin' || role === 'miembro' || role === 'member') {
      badge.hidden = false;
      badge.setAttribute('badge-role', role === 'admin' ? 'admin' : 'member');
      badge.textContent = role === 'admin' ? 'Admin' : 'Miembro';
    } else {
      badge.hidden = true;
      badge.removeAttribute('badge-role');
      badge.textContent = '';
    }
  }

  isAllowedImageSource(source) {
    try {
      const protocol = new URL(source, document.baseURI).protocol;
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }
}

if (!customElements.get('user-avatar')) {
  customElements.define('user-avatar', UserAvatar);
}