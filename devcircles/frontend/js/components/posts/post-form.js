import { BaseComponent } from '../base-component.js';

/**
 * Formulario para crear un post. Avisa con el evento 'post-submit',
 * cuyo detail trae los campos listos para mandarle al servicio.
 */
export class PostForm extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      form {
        display: grid;
        gap: var(--space-3, 0.75rem);
        padding: var(--space-4, 1rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-md, 0.75rem);
        background: var(--surface-color, #fff);
        box-shadow: var(--shadow-card, 0 1px 3px rgb(15 23 42 / 10%));
      }
      label { display: grid; gap: 0.25rem; color: var(--text-color, #172033); font-size: 0.85rem; font-weight: 650; }
      input, textarea, select {
        padding: 0.5rem 0.6rem;
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-sm, 0.375rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        font: inherit;
        font-weight: 400;
      }
      textarea { min-height: 5rem; resize: vertical; }
      textarea[name="codigo"] { font-family: var(--font-monospace, monospace); font-size: 0.85rem; }
      .fila { display: flex; gap: var(--space-3, 0.75rem); }
      .fila > * { flex: 1; }
      .snippet[hidden] { display: none; }
      .snippet { display: grid; gap: var(--space-3, 0.75rem); }
      .acciones { display: flex; justify-content: flex-end; gap: var(--space-2, 0.5rem); align-items: center; }
      .error { color: var(--error-color, #b91c1c); font-size: 0.85rem; }
      .error[hidden] { display: none; }
      button {
        padding: 0.5rem 1rem;
        border: 0;
        border-radius: var(--radius-full, 9999px);
        color: var(--on-primary, #fff);
        background: var(--primary-color, #2563eb);
        font: inherit;
        font-weight: 650;
      }
      button:hover { background: var(--primary-color-hover, #1d4ed8); }
      button[disabled] { opacity: 0.6; }
    </style>
    <form>
      <div class="fila">
        <label>Tipo
          <select name="tipo">
            <option value="publicacion">Publicación</option>
            <option value="pregunta">Pregunta</option>
            <option value="snippet">Snippet de código</option>
          </select>
        </label>
        <label>Título (opcional)
          <input name="titulo" type="text" maxlength="150" placeholder="Un título corto">
        </label>
      </div>

      <label>Contenido
        <textarea name="contenido" required maxlength="10000" placeholder="¿Qué querés compartir?"></textarea>
      </label>

      <div class="snippet" hidden>
        <div class="fila">
          <label>Lenguaje
            <input name="lenguaje" type="text" maxlength="30" placeholder="javascript">
          </label>
          <label>Nombre del archivo (opcional)
            <input name="nombre_archivo" type="text" maxlength="120" placeholder="app.js">
          </label>
        </div>
        <label>Código
          <textarea name="codigo" maxlength="50000" placeholder="Pegá tu código acá"></textarea>
        </label>
      </div>

      <label>Etiquetas (separadas por coma, hasta 5)
        <input name="etiquetas" type="text" placeholder="javascript, node, backend">
      </label>

      <div class="acciones">
        <span class="error" hidden></span>
        <button type="submit">Publicar</button>
      </div>
    </form>
  `;

  constructor() {
    super();
    const form = this.shadowRoot.querySelector('form');
    const snippet = this.shadowRoot.querySelector('.snippet');

    form.elements.tipo.addEventListener('change', (evento) => {
      snippet.hidden = evento.target.value !== 'snippet';
    });

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      this.enviar();
    });
  }

  enviar() {
    const form = this.shadowRoot.querySelector('form');
    const tipo = form.elements.tipo.value;
    const codigo = form.elements.codigo.value.trim();
    const lenguaje = form.elements.lenguaje.value.trim();

    if (tipo === 'snippet' && (!codigo || !lenguaje)) {
      this.error = 'Los snippets necesitan lenguaje y código';
      return;
    }
    this.error = '';

    const etiquetas = form.elements.etiquetas.value
      .split(',')
      .map((parte) => parte.trim())
      .filter(Boolean)
      .slice(0, 5);

    this.dispatchEvent(new CustomEvent('post-submit', {
      bubbles: true,
      composed: true,
      detail: {
        tipo,
        titulo: form.elements.titulo.value.trim(),
        contenido: form.elements.contenido.value.trim(),
        etiquetas,
        lenguaje,
        codigo,
        nombre_archivo: form.elements.nombre_archivo.value.trim(),
      },
    }));
  }

  set error(mensaje) {
    const nodo = this.shadowRoot.querySelector('.error');
    nodo.textContent = mensaje ?? '';
    nodo.hidden = !mensaje;
  }

  set enviando(valor) {
    const boton = this.shadowRoot.querySelector('button[type="submit"]');
    boton.disabled = Boolean(valor);
    boton.textContent = valor ? 'Publicando...' : 'Publicar';
  }

  limpiar() {
    const form = this.shadowRoot.querySelector('form');
    form.reset();
    this.shadowRoot.querySelector('.snippet').hidden = true;
    this.error = '';
  }
}

if (!customElements.get('post-form')) {
  customElements.define('post-form', PostForm);
}
