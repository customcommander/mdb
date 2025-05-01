import { filter, map, scan, Subject, zip } from "rxjs";

const group_by = (index, xs) => (
  xs.reduce((g, x) => {
    const idx = index(x);
    if (!g.has(idx)) g.set(idx, []);
    g.get(idx).push(x);
    return g;
  }, new Map())
);

export function key() {
  return (new Subject).pipe(
    map(e => e.key)
  );
}

export function shortcut(key$, shortcuts) {
  let groups = group_by(str => str.split('+').length, shortcuts);

  groups = [...groups].map(([len, list]) => key$.pipe(
    scan((seq, key) => {
      const idx = seq.length < len ? 0 : 1;
      return seq.slice(idx).concat(key);
    }, []),

    map(seq => {
      const shortcut = seq.join('+');
      return list.includes(shortcut) ? shortcut : null;
    })
  ));

  return zip(groups).pipe(
    map(out => {
      const candidates = out.filter(x => x != null);
      if (candidates.length == 0) return null;
      return candidates.reduce((max, cur) => max.length > cur.length ? max : cur);
    }),

    filter(shortcut => shortcut != null)
  );
}

