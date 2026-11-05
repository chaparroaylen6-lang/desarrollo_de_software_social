import { BaseComponent } from '../base-component.js';

export class UserBadge extends BaseComponent {
  static template = `
    <style>
      :host { display: inline-flex; }
      :host([hidden]) { display: none; }
      span {
        padding: 0.1rem 0.4rem;
        border-radius: var(--radius-full, 9999px);
        color: var(--surface-color, #fff);
        background: var(--primary-color, #2563eb);
        font: 600 0.65rem/1.4 var(--font-family, sans-serif);
        text-transform: uppercase;
      }
      :host([badge-role="admin"]) span { background: var(--warning-color, #b45309); }
    </style>
    <span part="badge"><slot></slot></span>
  `;
}

if (!customElements.get('user-badge')) {
  customElements.define('user-badge', UserBadge);
}