import { BaseComponent } from '../base-component.js';

/**
 * Barra de navegación. Va en el hueco de la derecha del header.
 * No sabe nada de la API: recibe el usuario por propiedad y avisa
 * con el evento 'cerrar-sesion' cuando tocan salir.
 */
export class NavPrincipal extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      nav { display: flex; align-items: center; gap: var(--space-4, 1rem); padding-right: 16px; }
      a {
        color: var(--nav-text, #cdd6f4);
        font-size: 0.95rem;
        text-decoration: none;
      }
      a:hover { text-decoration: underline; }
      .usuario { display: flex; align-items: center; gap: var(--space-2, 0.5rem); }
      .nombre { color: var(--nav-accent, #cba6f7); font-weight: 650; }
      .pendientes {
        min-width: 1.25rem;
        padding: 0 0.3rem;
        border-radius: 999px;
        color: #fff;
        background: var(--error-color, #b91c1c);
        font-size: 0.72rem;
        line-height: 1.25rem;
        text-align: center;
      }
      .pendientes[hidden] { display: none; }
      button {
        padding: 0.3rem 0.7rem;
        border: 1px solid var(--nav-borde, #45475a);
        border-radius: 999px;
        color: var(--nav-text, #cdd6f4);
        background: transparent;
        font: inherit;
        font-size: 0.85rem;
      }
      button:hover { background: var(--nav-borde, #45475a); }
    </style>
    <nav>
      <a href="#/feed">Feed</a>
      <a href="#/notificaciones" class="link-notis">
        Notificaciones <span class="pendientes" hidden>0</span>
      </a>
      <span class="usuario"></span>
    </nav>
  `;

  constructor() {
    super();
    this._usuario = null;
    this._pendientes = 0;
  }

  connectedCallback() {
    this.render();
  }

  set usuario(valor) {
    this._usuario = valor;
    this.render();
  }

  get usuario() {
    return this._usuario;
  }

  set pendientes(valor) {
    this._pendientes = Number(valor) || 0;
    this.render();
  }

  render() {
    if (!this.isConnected) return;

    const contenedor = this.shadowRoot.querySelector('.usuario');
    contenedor.replaceChildren();

    const badge = this.shadowRoot.querySelector('.pendientes');
    badge.textContent = String(this._pendientes);
    badge.hidden = !this._usuario || this._pendientes === 0;
    this.shadowRoot.querySelector('.link-notis').hidden = !this._usuario;

    if (!this._usuario) {
      const entrar = document.createElement('a');
      entrar.href = '#/login';
      entrar.textContent = 'Iniciar sesión';
      contenedor.append(entrar);
      return;
    }

    const nombre = document.createElement('span');
    nombre.className = 'nombre';
    nombre.textContent = this._usuario.username;

    const salir = document.createElement('button');
    salir.type = 'button';
    salir.textContent = 'Salir';
    salir.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('cerrar-sesion', { bubbles: true, composed: true }));
    });

    contenedor.append(nombre, salir);
  }
}

if (!customElements.get('nav-principal')) {
  customElements.define('nav-principal', NavPrincipal);
}
