import { BaseComponent } from '../base-component.js';

export class ToastMessage extends BaseComponent {
  static observedAttributes = ['message', 'type', 'duration'];

  static template = `
    <style>
      :host {
        position: fixed;
        z-index: 1000;
        right: var(--space-4, 1rem);
        bottom: var(--space-4, 1rem);
        display: block;
        max-width: min(28rem, calc(100vw - 2rem));
      }
      .toast {
        display: flex;
        align-items: center;
        gap: var(--space-3, 0.75rem);
        padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-left: 0.3rem solid var(--primary-color, #2563eb);
        border-radius: var(--radius-md, 0.75rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        box-shadow: var(--shadow-card, 0 1px 3px rgb(15 23 42 / 10%));
      }
      :host([type="success"]) .toast { border-left-color: var(--success-color, #15803d); }
      :host([type="warning"]) .toast { border-left-color: var(--warning-color, #b45309); }
      :host([type="error"]) .toast { border-left-color: var(--error-color, #b91c1c); }
      .message { flex: 1; }
      button { border: 0; color: inherit; background: transparent; font-size: 1.2rem; }
    </style>
    <div class="toast" role="status" aria-live="polite">
      <span class="message"></span>
      <button type="button" aria-label="Cerrar notificación">×</button>
    </div>
  `;

  constructor() {
    super();
    this.timer = null;
    this.shadowRoot.querySelector('button').addEventListener('click', () => this.remove());
  }

  connectedCallback() {
    this.update();
    this.scheduleRemoval();
  }

  disconnectedCallback() {
    window.clearTimeout(this.timer);
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }

  get message() {
    return this._message ?? this.getAttribute('message') ?? '';
  }

  set message(value) {
    this._message = String(value ?? '');
    this.update();
  }

  show(message, { type = 'info', duration = 4000 } = {}) {
    this.message = message;
    this.setAttribute('type', type);
    this.setAttribute('duration', String(duration));
    if (!this.isConnected) document.body.append(this);
    this.scheduleRemoval();
    return this;
  }

  update() {
    const message = this.shadowRoot.querySelector('.message');
    if (!message) return;
    message.textContent = this.message;
    const type = this.getAttribute('type') || 'info';
    const labels = { success: 'Éxito', error: 'Error', warning: 'Atención', info: 'Información' };
    const toast = this.shadowRoot.querySelector('.toast');
    toast.setAttribute('aria-label', labels[type] || labels.info);
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  }

  scheduleRemoval() {
    window.clearTimeout(this.timer);
    const duration = Number(this.getAttribute('duration') ?? 4000);
    const delay = Number.isFinite(duration) ? Math.max(0, duration) : 4000;
    this.timer = window.setTimeout(() => this.remove(), delay);
  }
}

if (!customElements.get('toast-message')) {
  customElements.define('toast-message', ToastMessage);
}