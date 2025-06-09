import {LitElement, css, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styleMap} from 'lit/directives/style-map.js';
import {debounceTime, fromEvent, map, startWith} from 'rxjs';

import './component-card.js';

class Cards extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }

    #spacer {
      position: relative;
    }

    mdb-card {
      position: absolute;
    }
  `;
  
  static properties = {
    view:   {type: String},
    width:  {type: Number},
    height: {type: Number},
    items:  {attribute: false},
    _page:  {state: true},
  };

  constructor() {
    super();
    this.items = [];
    this.view = 'table';
  }

  connectedCallback() {
    super.connectedCallback();

    const scroll$ = fromEvent(this, 'scrollend').pipe(
      debounceTime(100),
      map(() => this.scrollTop),
      startWith(0)
    );

    this._listen = scroll$.subscribe(pos => {
      this._page = Math.floor(pos / this.height);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._listen.unsubscribe();
  }

  _dimensions() {
    const minw = this.view == 'table' ? this.width : 200;
    const minh = this.view == 'table' ? 75 : 350;
    const cols = Math.floor(this.width / minw);
    const rows = Math.floor(this.height / minh);
    const area = cols * rows;
    const cardw = this.width / cols;
    const cardh = this.height / rows;
    return {cols, rows, area, cardw, cardh};
  }

  *slice() {
    const {cols, area, cardw, cardh} = this._dimensions();
    const page = this._page;
    const from = Math.max(0, page - 1) * area;
    const max = Math.min(this.items.length, (page + 3) * area);

    for (let i = from; i < max; i++) {
      const top = Math.floor(i / cols) * cardh;
      const left = (i % cols) * cardw;
      yield [i, top, left, cardw, cardh];
    }
  }

  render() {
    const len = this.items.length;
    const noItems = len === 0;

    // Assumes that a 'no results' message is provided by the parent.
    if (noItems) {
      return html`<slot></slot>`;
    }

    const {area} = this._dimensions();
    const fullHeight = (len / area) * this.height;

    return html`
      <div id="spacer" style=${styleMap({height: `${fullHeight}px`})}>
        ${repeat(this.slice(), ([index]) => this.items[index].id,
          ([index, top, left, width, height]) => {
            const card = this.items[index];
            const styles = {top:    `${top}px`,
                            left:   `${left}px`,
                            width:  `${width}px`,
                            height: `${height}px`};
            return html`
              <mdb-card .card=${card}
                        view=${this.view}
                        style=${styleMap(styles)}></mdb-card>
            `;
          }
        )}
      </div>
    `;
  }
}

customElements.define('mdb-cards', Cards);

