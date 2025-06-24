import {LitElement, css, html, nothing} from 'lit';

const symMap = {
  black: 'B',
  blue:  'U',
  green: 'G',
  red:   'R',
  white: 'W'
};

class ManaCost extends LitElement {

  static styles = css`

    :host {
      display: inline;
    }

    ol {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0;
      padding: 0;
    }
  `;

  static properties = {
    colorless: {type: Number},
    black:     {type: Number},
    blue:      {type: Number},
    green:     {type: Number},
    red:       {type: Number},
    white:     {type: Number},
  };

  constructor() {
    super();
  }

  _cost(mana) {
    const num = this[mana];
    if (num == null) return nothing;
    if (mana == 'colorless') return html`<li>${num}</li>`;
    return html`<li>${symMap[mana].repeat(num)}</li>`;
  }

  render() {
    return html`
      <ol>
        ${this._cost('colorless')}
        ${this._cost('black'    )}
        ${this._cost('blue'     )}
        ${this._cost('green'    )}
        ${this._cost('red'      )}
        ${this._cost('white'    )}
      </ol>
    `;
  }
}

customElements.define('mdb-mana-cost', ManaCost);

