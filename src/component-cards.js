import {LitElement, css, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styleMap} from 'lit/directives/style-map.js';
import {combineLatest, debounceTime, fromEvent, map, startWith} from 'rxjs';

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
    items:   {attribute: false},
    _width:  {state: true},
    _height: {state: true},
    _page:   {state: true},
  };

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();

    /*

    Dimensions and positions are computed based on scroll
    and resize events. However we need that information,
    on initial render too and we cannot assume that the
    user will trigger these events at that time.

    The `startWith` trick below serves two purposes:

    1. Make sure both observables emit immediately after
       being subscribed to, so we can have initial dimensions
       and position.

    2. The `combineLatest` produces an observable that starts
       emitting only after each combined observable has
       emitted at least once.

       Since we cannot assume that the user will trigger
       both events we need to make sure that the two
       combined observables have both emitted at least
       once.

    */

    const resize$ = fromEvent(window, 'resize').pipe(
      startWith('╰(°□°╰)')
    );

    const scroll$ = fromEvent(this, 'scrollend').pipe(
      startWith('╰(°□°╰)')
    );

    const combined$ = combineLatest([resize$, scroll$]).pipe(
      debounceTime(50),
      map(() => {
        const {width, height} = this.getBoundingClientRect();
        const pos = this.scrollTop;
        return [width, height, pos];
      })
    );

    this._listen = combined$.subscribe(([width, height, pos]) => {
      this._width = width;
      this._height = height;
      this._page = Math.floor(pos / height);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._listen.unsubscribe();
  }

  _dimensions() {
    const minw = 200; // TODO: this should be based on an attribute
    const minh = 350; // TODO: this should be based on an attribute
    const cols = Math.floor(this._width / minw);
    const rows = Math.floor(this._height / minh);
    const area = cols * rows;
    const cardw = this._width / cols;
    const cardh = this._height / rows;
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
    const fullHeight = (len / area) * this._height;

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
              <mdb-card style=${styleMap(styles)}>
                <img src=${card.image} />
              </mdb-card>
            `;
          }
        )}
      </div>
    `;
  }
}

customElements.define('mdb-cards', Cards);

 
