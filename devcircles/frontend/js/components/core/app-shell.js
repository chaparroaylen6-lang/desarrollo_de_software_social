import { BaseComponent } from '../base-component.js';

export class AppShell extends BaseComponent {
  static template = `
    <style>
      :host {
        display: block;
        min-height: 100vh;
        color: var(--text-color, #172033);
        font-family: var(--font-family, sans-serif);
      }
      .shell { width: min(100% - 2rem, 72rem); min-height: 100vh; margin-inline: auto; }
    </style>
    <div class="shell">
      <slot name="header"></slot>
      <slot></slot>
      <slot name="footer"></slot>
    </div>
  `;
}

if (!customElements.get('app-shell')) {
  customElements.define('app-shell', AppShell);
}