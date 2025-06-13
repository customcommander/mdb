import {
  LitElement,
  css,
  html
} from 'lit';

class OmniBar extends LitElement {

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: white;
      border-bottom: 1px solid black;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('mdb-omnibar', OmniBar);


