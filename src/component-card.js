import {LitElement, css, html} from 'lit';

class Card extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    ::slotted(img) {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('mdb-card', Card);

