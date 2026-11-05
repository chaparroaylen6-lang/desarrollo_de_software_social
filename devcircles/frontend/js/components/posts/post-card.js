import { BaseComponent } from '../base-component.js';
import '../users/user-avatar.js';
import '../shared/tag-chip.js';
import './code-snippet.js';
import './like-button.js';

export class PostCard extends BaseComponent {
  static template = `
    <style>
      :host { display: block; }
      article {
        display: grid;
        gap: var(--space-4, 1rem);
        padding: var(--space-4, 1rem);
        border: 1px solid var(--border-color, #dbe3ee);
        border-radius: var(--radius-md, 0.75rem);
        color: var(--text-color, #172033);
        background: var(--surface-color, #fff);
        box-shadow: var(--shadow-card, 0 1px 3px rgb(15 23 42 / 10%));
      }
      header { display: flex; align-items: center; gap: var(--space-3, 0.75rem); }
      .author { display: grid; gap: 0.1rem; }
      .username { font-weight: 650; }
      time { color: var(--muted-color, #64748b); font-size: 0.8rem; }
      .content { margin: 0; overflow-wrap: anywhere; white-space: pre-wrap; }
      .tags { display: flex; flex-wrap: wrap; gap: var(--space-2, 0.5rem); }
      footer { border-top: 1px solid var(--border-color, #dbe3ee); padding-top: var(--space-2, 0.5rem); }
      code-snippet[hidden], .tags[hidden] { display: none; }
    </style>
    <article>
      <header>
        <user-avatar></user-avatar>
        <div class="author">
          <span class="username"></span>
          <time></time>
        </div>
      </header>
      <p class="content"></p>
      <code-snippet hidden></code-snippet>
      <div class="tags"></div>
      <footer><like-button></like-button></footer>
    </article>
  `;

  constructor() {
    super();
    this._post = null;
  }

  connectedCallback() {
    this.render();
  }

  get post() {
    return this._post;
  }

  set post(value) {
    this._post = value && typeof value === 'object' ? value : null;
    this.render();
  }

  render() {
    if (!this.isConnected) return;
    const post = this._post ?? {};
    const postId = post.id ?? this.getAttribute('post-id') ?? this.dataset.postId ?? '';
    const username = post.username ?? post.usuario?.username ?? this.getAttribute('username') ?? 'Usuario';
    const avatar = post.avatar ?? post.usuario?.avatar ?? this.getAttribute('avatar') ?? '';
    const role = post.rol ?? post.usuario?.rol ?? this.getAttribute('rol') ?? '';
    const content = post.content ?? post.contenido ?? this.getAttribute('content') ?? '';
    const type = post.type ?? post.tipo ?? this.getAttribute('type') ?? 'text';
    const code = post.code ?? post.codigo ?? this.getAttribute('code') ?? '';
    const language = post.language ?? post.lenguaje ?? this.getAttribute('language') ?? 'text';
    const likes = post.likes ?? this.getAttribute('likes') ?? 0;
    const liked = post.liked ?? this.hasAttribute('liked');
    const tags = post.tags ?? [];

    const userAvatar = this.shadowRoot.querySelector('user-avatar');
    userAvatar.setAttribute('username', username);
    if (avatar) userAvatar.setAttribute('src', avatar);
    else userAvatar.removeAttribute('src');
    if (role) userAvatar.setAttribute('rol', role);
    else userAvatar.removeAttribute('rol');
    this.shadowRoot.querySelector('.username').textContent = username;
    this.shadowRoot.querySelector('.content').textContent = content;

    const time = this.shadowRoot.querySelector('time');
    const date = post.createdAt ?? post.created_at;
    if (date) {
      const parsed = new Date(date);
      if (!Number.isNaN(parsed.getTime())) {
        time.dateTime = parsed.toISOString();
        time.textContent = new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(parsed);
      } else {
        time.removeAttribute('datetime');
        time.textContent = '';
      }
    } else {
      time.removeAttribute('datetime');
      time.textContent = '';
    }

    const snippet = this.shadowRoot.querySelector('code-snippet');
    const isSnippet = type === 'snippet' || type === 'code';
    snippet.hidden = !isSnippet;
    if (isSnippet) {
      snippet.language = language;
      snippet.code = code;
    }
    this.shadowRoot.querySelector('.content').hidden = isSnippet && !content;

    const tagList = this.shadowRoot.querySelector('.tags');
    tagList.replaceChildren();
    for (const tag of Array.isArray(tags) ? tags : []) {
      const chip = document.createElement('tag-chip');
      chip.tag = typeof tag === 'string' ? tag : tag.nombre ?? tag.name ?? '';
      tagList.append(chip);
    }
    tagList.hidden = tagList.childElementCount === 0;

    const likeButton = this.shadowRoot.querySelector('like-button');
    likeButton.setAttribute('post-id', postId);
    likeButton.likes = likes;
    likeButton.liked = liked;
  }
}

if (!customElements.get('post-card')) {
  customElements.define('post-card', PostCard);
}