import { BaseComponent } from '../base-component.js';

export class TagChip extends BaseComponent {
  static observedAttributes = ['tag'];

  static template = `
    <style>
      :host { display: inline-flex; }
      button {
        padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-full, 9999px);
        color: var(--primary-color, #2563eb);
        background: var(--surface-color, #fff);
        font: inherit;
        font-size: 0.875rem;
      }
      button:hover { border-color: var(--primary-color, #2563eb); }
    </style>
    <button type="button"></button>
  `;

  connectedCallback() {
    this.update();
    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('tag-select', {
        detail: { tag: this.tag },
        bubbles: true,
        composed: true,
      }));
    });
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }

  get tag() {
    return this.getAttribute('tag')?.replace(/^#/, '').trim() || '';
  }

  set tag(value) {
    this.setAttribute('tag', String(value));
  }

  update() {
    const tag = this.tag;
    const button = this.shadowRoot.querySelector('button');
    button.textContent = tag ? `#${tag}` : '#etiqueta';
    button.setAttribute('aria-label', `Filtrar por etiqueta ${tag || 'sin nombre'}`);
  }
}

if (!customElements.get('tag-chip')) {
  customElements.define('tag-chip', TagChip);
}