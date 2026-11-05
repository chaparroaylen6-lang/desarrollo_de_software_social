import { BaseComponent } from '../base-component.js';

export class ModalDialog extends BaseComponent {
  static observedAttributes = ['open'];

  static template = `
    <style>
      :host { display: contents; }
      dialog {
        width: min(90vw, 36rem);
        max-height: 85vh;
        padding: var(--space-6, 1.5rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-md, 0.75rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        box-shadow: var(--shadow-card, 0 1px 3px rgb(15 23 42 / 10%));
      }
      dialog::backdrop { background: rgb(15 23 42 / 55%); }
    </style>
    <dialog aria-modal="true"><slot></slot></dialog>
  `;

  constructor() {
    super();
    this.dialog = this.shadowRoot.querySelector('dialog');
    this.dialog.addEventListener('close', () => {
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('closed', {
        detail: { returnValue: this.dialog.returnValue },
        bubbles: true,
        composed: true,
      }));
    });
  }

  connectedCallback() {
    if (this.hasAttribute('open')) this.open();
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name !== 'open' || !this.isConnected) return;
    if (newValue === null) this.close();
    else this.open();
  }

  open() {
    if (this.dialog.open) return;
    if (typeof this.dialog.showModal === 'function') this.dialog.showModal();
    else this.dialog.setAttribute('open', '');
  }

  close(returnValue = '') {
    if (!this.dialog.open) return;
    if (typeof this.dialog.close === 'function') this.dialog.close(returnValue);
    else {
      this.dialog.removeAttribute('open');
      this.removeAttribute('open');
      this.dispatchEvent(new CustomEvent('closed', {
        detail: { returnValue },
        bubbles: true,
        composed: true,
      }));
    }
  }
}

if (!customElements.get('modal-dialog')) {
  customElements.define('modal-dialog', ModalDialog);
}