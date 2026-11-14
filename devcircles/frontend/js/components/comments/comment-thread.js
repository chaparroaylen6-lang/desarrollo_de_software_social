import { BaseComponent } from '../base-component.js';
import './comment-item.js';

/**
 * Lista de comentarios + caja para escribir uno nuevo.
 * Recibe los comentarios por propiedad y avisa con 'comentario-submit'.
 */
export class CommentThread extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      section {
        display: grid;
        gap: var(--space-2, 0.5rem);
        padding: var(--space-4, 1rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-md, 0.75rem);
        background: var(--surface-color, #fff);
      }
      h3 { margin: 0; color: var(--text-color, #172033); font-size: 0.95rem; }
      .vacio { color: var(--muted-color, #64748b); font-size: 0.9rem; }
      .vacio[hidden] { display: none; }
      form { display: flex; gap: var(--space-2, 0.5rem); margin-top: var(--space-2, 0.5rem); }
      form[hidden] { display: none; }
      input {
        flex: 1;
        padding: 0.5rem 0.6rem;
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-sm, 0.375rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        font: inherit;
      }
      button {
        padding: 0.5rem 0.9rem;
        border: 0;
        border-radius: var(--radius-full, 9999px);
        color: var(--on-primary, #fff);
        background: var(--primary-color, #2563eb);
        font: inherit;
        font-weight: 650;
      }
      button[disabled] { opacity: 0.6; }
      .aviso { color: var(--muted-color, #64748b); font-size: 0.85rem; }
      .aviso[hidden] { display: none; }
    </style>
    <section>
      <h3>Comentarios</h3>
      <div class="lista"></div>
      <p class="vacio" hidden>Nadie comentó todavía.</p>
      <form>
        <input name="contenido" type="text" maxlength="1000" placeholder="Escribí un comentario" required>
        <button type="submit">Enviar</button>
      </form>
      <p class="aviso" hidden>Iniciá sesión para comentar.</p>
    </section>
  `;

  constructor() {
    super();
    this._comentarios = [];
    this._puedeComentar = true;

    this.shadowRoot.querySelector('form').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const input = evento.target.elements.contenido;
      const contenido = input.value.trim();
      if (!contenido) return;

      this.dispatchEvent(new CustomEvent('comentario-submit', {
        bubbles: true,
        composed: true,
        detail: { contenido },
      }));
      input.value = '';
    });
  }

  connectedCallback() {
    this.render();
  }

  set comentarios(valor) {
    this._comentarios = Array.isArray(valor) ? valor : [];
    this.render();
  }

  get comentarios() {
    return this._comentarios;
  }

  set puedeComentar(valor) {
    this._puedeComentar = Boolean(valor);
    this.render();
  }

  render() {
    if (!this.isConnected) return;

    const lista = this.shadowRoot.querySelector('.lista');
    lista.replaceChildren();
    for (const comentario of this._comentarios) {
      const item = document.createElement('comment-item');
      item.comentario = comentario;
      lista.append(item);
    }

    this.shadowRoot.querySelector('.vacio').hidden = this._comentarios.length > 0;
    this.shadowRoot.querySelector('form').hidden = !this._puedeComentar;
    this.shadowRoot.querySelector('.aviso').hidden = this._puedeComentar;
  }
}

if (!customElements.get('comment-thread')) {
  customElements.define('comment-thread', CommentThread);
}
