import {LitElement, css, html, nothing} from 'lit';

import './component-mana-cost.js';
import './component-pt.js';

class Card extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    :host([view="grid"]) {
      display: block;
    }

    :host([view="table"]) {
      display: grid;
      grid-template-columns: 3fr 3fr 1fr 1fr;
      grid-template-rows: 1fr 2fr;
    }

    .desc {
      grid-column: 1 / -1;
      overflow: hidden;
      font-size: 0.9em;
    }

    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  `;

  static properties = {
    view: {type: String},
    card: {attribute: false}
  };

  constructor() {
    super();
  }

  renderPtCell() {
    const p = this.card.power;
    const t = this.card.toughness;
    if (!p || !t) return html`<div></div>`;
    return html`<mdb-pt power=${p.value} toughness=${t.value}></mdb-pt>`;
  }

  render() {
    if (this.view == 'grid') {
      return html`<img src=${this.card.image} />`;
    }

    if (this.view == 'table') {
      return html`
        <div><strong>${this.card.name}</strong></div>
        <div>${this.card.types.join(' ')}</div>
        ${this.renderPtCell()}
        <mdb-mana-cost
          colorless=${this.card.mana_cost?.colorless ?? nothing}
              black=${this.card.mana_cost?.black     ?? nothing}
               blue=${this.card.mana_cost?.blue      ?? nothing}
              green=${this.card.mana_cost?.green     ?? nothing}
                red=${this.card.mana_cost?.red       ?? nothing}
              white=${this.card.mana_cost?.white     ?? nothing}></mdb-mana-cost>
        <div class="desc">${this.card.text}</div>
      `;
    }
  }
}

customElements.define('mdb-card', Card);

