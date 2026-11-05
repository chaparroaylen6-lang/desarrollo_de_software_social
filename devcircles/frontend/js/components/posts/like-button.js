import { BaseComponent } from '../base-component.js';

export class LikeButton extends BaseComponent {
  static observedAttributes = ['likes', 'count', 'liked', 'active', 'post-id', 'data-post-id'];

  static template = `
    <style>
      :host { display: inline-flex; }
      button {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2, 0.5rem);
        padding: var(--space-2, 0.5rem);
        border: 0;
        border-radius: var(--radius-full, 9999px);
        color: var(--muted-color, #64748b);
        background: transparent;
        font: inherit;
      }
      button:hover { background: var(--surface-subtle-color, #f1f5f9); }
      button[aria-pressed="true"] { color: var(--error-color, #b91c1c); }
      .heart { font-size: 1.15rem; line-height: 1; }
    </style>
    <button type="button" aria-pressed="false" aria-label="Me gusta">
      <span class="heart" aria-hidden="true">♡</span>
      <span class="count">0</span>
    </button>
  `;

  constructor() {
    super();
    this._likes = null;
    this._liked = null;
    this.shadowRoot.querySelector('button').addEventListener('click', () => this.toggle());
  }

  connectedCallback() {
    if (this._likes === null) this._likes = this.readCountAttribute();
    if (this._liked === null) this._liked = this.hasAttribute('liked') || this.hasAttribute('active');
    this.update();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    if (this._likes !== null) this._likes = this.readCountAttribute();
    if (this._liked !== null) this._liked = this.hasAttribute('liked') || this.hasAttribute('active');
    this.update();
  }

  get likes() {
    return this._likes ?? this.readCountAttribute();
  }

  set likes(value) {
    this._likes = this.normalizeCount(value);
    this.update();
  }

  get liked() {
    return this._liked ?? (this.hasAttribute('liked') || this.hasAttribute('active'));
  }

  set liked(value) {
    this._liked = Boolean(value);
    this.update();
  }

  readCountAttribute() {
    return this.normalizeCount(this.getAttribute('likes') ?? this.getAttribute('count'));
  }

  normalizeCount(value) {
    const count = Number(value);
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  }

  toggle() {
    this._liked = !this.liked;
    this._likes = Math.max(0, this.likes + (this._liked ? 1 : -1));
    this.update();
    this.dispatchEvent(new CustomEvent('like-toggle', {
      detail: {
        postId: this.getAttribute('post-id') ?? this.getAttribute('data-post-id'),
        liked: this._liked,
        likes: this._likes,
      },
      bubbles: true,
      composed: true,
    }));
  }

  update() {
    const button = this.shadowRoot.querySelector('button');
    button.setAttribute('aria-pressed', String(this.liked));
    button.setAttribute('aria-label', this.liked ? 'Quitar me gusta' : 'Me gusta');
    this.shadowRoot.querySelector('.heart').textContent = this.liked ? '♥' : '♡';
    this.shadowRoot.querySelector('.count').textContent = String(this.likes);
  }
}

if (!customElements.get('like-button')) {
  customElements.define('like-button', LikeButton);
}