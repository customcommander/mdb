import test from 'node:test';
import assert from 'node:assert/strict';

import { shortcut } from "../../src/shortcut.js";
import { Subject } from 'rxjs';


test('emits shortcuts', () => {
  const key$ = new Subject;
  const shortcut$ = shortcut(key$, ['c', '-+c', 'a+-+c']);
  const out = [];

  shortcut$.subscribe(shortcut => out.push(shortcut));

  'x x a - c x - - c x a x c x'.split(' ').forEach(k => key$.next(k));

  assert.equal(out.length,       3);
  assert.equal(out[0]    , 'a+-+c');
  assert.equal(out[1]    ,   '-+c');
  assert.equal(out[2]    ,     'c');
});
