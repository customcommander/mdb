import {LitElement, css, html} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {styleMap} from 'lit/directives/style-map.js';
import {debounceTime, fromEvent, map} from 'rxjs';

import './component-card.js';

class Cards extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 100%;
      overflow-y: auto;
    }

    #spacer {
      position: relative;
    }

    mdb-card {
      position: absolute;
      border: 1px solid black;
      box-sizing: border-box;
    }
  `;
  
  static properties = {
    items: {
      attribute: false,
    },
    _cols: {
      state: true
    },
    _rows: {
      state: true
    },
    _slice: {
      state: true
    }
  };

  constructor() {
    super();
    this.items = [];
    this._cols = 3;
    this._rows = 2;
    this._slice = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this._resize = (
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(100),
          map(() => this.getBoundingClientRect())
        )
        .subscribe(({width, height}) => {
          this._cols = Math.min(4, Math.ceil(width / 250));
          this._rows = Math.max(1, Math.ceil(height / 400));
          this._computeSlice(this.scrollTop);
        })
    );
   
    this._scroll = (
      fromEvent(this, 'scrollend')
        .pipe(
          debounceTime(100),
          map(() => this.scrollTop)
        )
        .subscribe((pos) => {
          this._computeSlice(pos);
        })
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resize.unsubscribe();
    this._scroll.unsubscribe();
  }

  _computeArea(width, height) {
    if (width < 300) this._cols = 1;
    if (height < 500) this._rows = 1;
  }

  _computeSlice(pos) {
    const {width, height} = this.getBoundingClientRect();
    const area = this._cols * this._rows;
    const page = Math.floor(pos / height);

    // TODO: compute isLastPage?
    const isFirstPage = page === 0;

    let slice;

    if (isFirstPage) {
      slice = this.items.slice(0, area * 3);
    } else {
      // always provide content before and after current page for a smoother experience
      slice = this.items.slice((page - 1) * area, (page + 3) * area);
    }

    const cardw = width / this._cols;
    const cardh = height / this._rows;

    this._slice = slice.map((item, index) => [
      item,
      (Math.max(0, page - 1) * height) + (Math.floor(index / this._cols) * cardh),
      (index % this._cols) * cardw,
      cardw,
      cardh
    ]);
  }

  render() {
    if (this.items.length == 0) {
      return;
    }

    const {height} = this.getBoundingClientRect();
    const area = this._cols * this._rows;

    const spacer = {
      height: `${Math.ceil(this.items.length / area) * height}px`
    };

    return html`
      <div id="spacer" style=${styleMap(spacer)}>
      ${repeat(this._slice, ([item]) => item.id,
        ([item, top, left, width, height]) => {
          const card = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`
          };

          return html`
            <mdb-card image=${item.image}
                      style=${styleMap(card)}></mdb-card>
          `;
        }
      )}
      </div>
    `;
  }
}

customElements.define('mdb-cards', Cards);

 
