import {LitElement, css, html} from 'lit';
import { fromEvent, startWith, debounceTime, map, filter, delay } from 'rxjs';
import {key, shortcut} from './shortcut.js';
import engine from './engine.js';
import cards from '../cards.json';

import './component-cards.js';
import './component-omnibar.js';

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
  'd+g': {type: 'display'     , value: 'grid'                },
  'd+t': {type: 'display'     , value: 'table'               }
};


class App extends LitElement {

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
    }

    mdb-omnibar {
      width: 100vw;
      height: 80px;
      box-shadow: 0px 3px 4px #999999;
    }

    mdb-cards {
      width: 100vw;
    }
  `;

  static properties = {
    items:    {attribute: false},
    _display: {state: true}
  };

  constructor() {
    super();
    this.items = [];
    this._display = 'table';
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

    this.e.on('state.change', ({state, value}) => {
      console.log(`${state}=${value}`);
      this[`_${state}`] = value;
    });

    this.e.start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <mdb-omnibar>
        <p>search query here at some point...</p>
      </mdb-omnibar>
      <mdb-cards .items=${this.items} view=${this._display}>
        <p>no results for <mark>foo</mark></p>
      </mdb-cards>
    `;
  }
}

customElements.define('mdb-app', App);
