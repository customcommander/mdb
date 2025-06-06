import {LitElement, css, html} from 'lit';

class Card extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  `;

  static properties = {
    card: {attribute: false}
  };

  constructor() {
    super();
  }

  render() {
    return html`<img src=${this.card.image} />`;
  }
}

customElements.define('mdb-card', Card);

