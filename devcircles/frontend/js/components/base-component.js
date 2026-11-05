export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = this.constructor.template ?? '';
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}
