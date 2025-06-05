import {LitElement, css, html} from 'lit';
import { fromEvent, map, filter, delay } from 'rxjs';
import {key, shortcut} from './shortcut.js';
import engine from './engine.js~';
import cards from '../cards.json';

import './component-cards.js';
import './component-filter-color.js';

const shortcuts = {
    '?': {type: 'display.help'                               },
    'b': {type: 'filter.color', color: 'black'               },
    'g': {type: 'filter.color', color: 'green'               },
    'o': {type: 'filter.color', color: 'gold'                },
    'r': {type: 'filter.color', color: 'red'                 },
    'u': {type: 'filter.color', color: 'blue'                },
    'w': {type: 'filter.color', color: 'white'               },
  '-+b': {type: 'filter.color', color: 'black', exclude: true},
  '-+g': {type: 'filter.color', color: 'green', exclude: true},
  '-+o': {type: 'filter.color', color: 'gold' , exclude: true},
  '-+r': {type: 'filter.color', color: 'red'  , exclude: true},
  '-+u': {type: 'filter.color', color: 'blue' , exclude: true},
  '-+w': {type: 'filter.color', color: 'white', exclude: true},
};


class App extends LitElement {

  static styles = css`
    :host {
      display: block;
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
    }

    mdb-cards {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid red;
    }
  `;

  static properties = {
    items: {
      attribute: false
    }
  };

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this.key$ = key();
    this.shortcut$ = shortcut(this.key$, Object.keys(shortcuts));
    this.e = engine(cards);

    fromEvent(document, 'keydown').subscribe(
      this.key$
    );

    this.shortcut$.subscribe(shortcut => {
      console.log(`shortcut: ${shortcut}`);
      this.e.send(shortcuts[shortcut]);
    });

    this.e.on('results', ({payload}) => {
      this.items = payload;
    });

    this.e.start();
  }

  render() {
    return html`
      <mdb-cards .items=${this.items}>
        <p>no results for <mark>foo</mark></p>
      </mdb-cards>
    `;
  }
}

customElements.define('mdb-app', App);
