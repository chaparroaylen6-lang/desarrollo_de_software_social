import { BaseComponent } from '../base-component.js';

export class CodeSnippet extends BaseComponent {
  static observedAttributes = ['language'];

  static template = `
    <style>
      :host { display: block; overflow: hidden; border: 1px solid var(--border-color, #dbe3ee); border-radius: var(--radius-md, 0.75rem); }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
        color: var(--muted-color, #64748b);
        background: var(--surface-subtle-color, #f1f5f9);
        font: 0.8rem var(--font-family, sans-serif);
      }
      button {
        padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-sm, 0.375rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
      }
      pre {
        overflow-x: auto;
        margin: 0;
        padding: var(--space-3, 0.75rem) 0;
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        font: 0.875rem/1.55 var(--font-monospace, monospace);
      }
      code { display: block; }
      .line { display: grid; grid-template-columns: 3.25rem minmax(0, 1fr); min-height: 1.55em; }
      .number { padding-right: var(--space-3, 0.75rem); color: var(--muted-color, #64748b); text-align: right; user-select: none; }
      .source { padding-right: var(--space-4, 1rem); white-space: pre; }
    </style>
    <header>
      <span class="language"></span>
      <button type="button" class="copy">Copiar</button>
    </header>
    <pre aria-label="Código fuente"><code></code></pre>
  `;

  constructor() {
    super();
    this._code = null;
    this.shadowRoot.querySelector('.copy').addEventListener('click', () => this.copyCode());
  }

  connectedCallback() {
    if (this._code === null) this._code = this.textContent;
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.updateLanguage();
  }

  get code() {
    return this._code ?? this.textContent;
  }

  set code(value) {
    this._code = String(value ?? '');
    this.renderCode();
  }

  get language() {
    return this.getAttribute('language')?.trim() || 'text';
  }

  set language(value) {
    this.setAttribute('language', String(value));
  }

  render() {
    this.updateLanguage();
    this.renderCode();
  }

  updateLanguage() {
    this.shadowRoot.querySelector('.language').textContent = this.language;
    this.shadowRoot.querySelector('pre').setAttribute('aria-label', `Código fuente en ${this.language}`);
  }

  renderCode() {
    const code = this.shadowRoot.querySelector('code');
    code.replaceChildren();
    const lines = this.code.replace(/\r\n?/g, '\n').split('\n');

    lines.forEach((text, index) => {
      const line = document.createElement('span');
      line.className = 'line';
      const number = document.createElement('span');
      number.className = 'number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1);
      const source = document.createElement('span');
      source.className = 'source';
      source.textContent = text || ' ';
      line.append(number, source);
      code.append(line);
    });
  }

  async copyCode() {
    const button = this.shadowRoot.querySelector('.copy');
    try {
      await navigator.clipboard.writeText(this.code);
      button.textContent = 'Copiado';
    } catch {
      button.textContent = 'No se pudo copiar';
    }
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = 'Copiar';
    }, 1600);
  }
}

if (!customElements.get('code-snippet')) {
  customElements.define('code-snippet', CodeSnippet);
}