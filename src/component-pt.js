import {LitElement, css, html, nothing} from 'lit';

class PowerThoughness extends LitElement {

  static styles = css`
    :host {
      display: inline;
    }
  `;

  static properties = {
    power:     {type: Number},
    toughness: {type: Number},
  };

  constructor() {
    super();
  }

  render() {
    return html`
      <span>${this.power}/${this.toughness}</span>
    `;
  }
}

customElements.define('mdb-pt', PowerThoughness);

