import {LitElement, css, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styleMap} from 'lit/directives/style-map.js';
import {debounceTime, fromEvent, map, startWith, combineLatest} from 'rxjs';

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
    view:    {type: String},
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

    this._listen =
      /*

      IMPORTANT:

      The observable returned by `combineLatest` starts emitting
      only after each combined observable has started emitting at least once.

      However we need both `resize` and `scrollend` to emit immediately
      as we have to compute the initial dimensions and position on page load.

      The `startWith` trick just makes sure this always happens as
      we cannot expect the user to trigger *both* events at the right time.

      As you might have guessed already; the `startWith` values are not important ;)

      */
      combineLatest([
        fromEvent(window, 'resize').pipe(
          startWith('(╯°□°）╯︵ ┻━┻')
        ),
        fromEvent(this, 'scrollend').pipe(
          startWith('(╯°□°）╯︵ ┻━┻')
        )
      ])
      .pipe(
        debounceTime(100),
        map(() => {
          const {width, height} = this.getBoundingClientRect();
          const pos = this.scrollTop;
          return [width, height, pos];
        })
      )
      .subscribe(([width, height, pos]) => {
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
    const minw = this.view == 'table' ? this._width : 200;
    const minh = this.view == 'table' ? 75 : 350;
    const cols = this.view == 'table' ? 1 : 3;
    const rows = Math.ceil(this._height / minh);
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
              <mdb-card .card=${card}
                        view=${this.view}
                        style=${styleMap(styles)}>
              </mdb-card>
            `;
          }
        )}
      </div>
    `;
  }
}

customElements.define('mdb-cards', Cards);

