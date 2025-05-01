import { fromEvent } from 'rxjs';
import {key, shortcut} from './shortcut.js';

const shortcuts = {
    'b': {type: 'filter.color', color: 'black'               },
    'g': {type: 'filter.color', color: 'green'               },
    'r': {type: 'filter.color', color: 'red'                 },
    'u': {type: 'filter.color', color: 'blue'                },
    'w': {type: 'filter.color', color: 'white'               },
  '-+b': {type: 'filter.color', color: 'black', exclude: true},
  '-+g': {type: 'filter.color', color: 'green', exclude: true},
  '-+r': {type: 'filter.color', color: 'red'  , exclude: true},
  '-+u': {type: 'filter.color', color: 'blue' , exclude: true},
  '-+w': {type: 'filter.color', color: 'white', exclude: true},
};

const key$ = key();
const shortcut$ = shortcut(key$, Object.keys(shortcuts));

fromEvent(document, 'keydown').subscribe(key$);

shortcut$.subscribe(shortcut => {
  console.log(`shortcut: ${shortcut}`);
});

