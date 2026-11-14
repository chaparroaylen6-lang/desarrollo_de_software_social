import { BaseComponent } from '../base-component.js';

export class EmptyState extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      .vacio {
        display: grid;
        gap: var(--space-2, 0.5rem);
        padding: var(--space-6, 1.5rem);
        border: 1px dashed var(--border-color, #dbe3ee);
        border-radius: var(--radius-md, 0.75rem);
        color: var(--muted-color, #64748b);
        background: var(--surface-color, #fff);
        text-align: center;
      }
    </style>
    <div class="vacio"><slot>No hay nada para mostrar todavía.</slot></div>
  `;
}

if (!customElements.get('empty-state')) {
  customElements.define('empty-state', EmptyState);
}
