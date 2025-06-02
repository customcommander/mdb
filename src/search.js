import lunr from 'lunr';
import { fromCallback } from 'xstate';


export default function (cards) {
  // TODO: lookup and both indexes can be JSON'ed

  const lookup = cards.reduce((m, card, index) => {
    const xs = [].concat(
      card.colors,
      card.keywords,
      card.types
    );

    m.set(card.id, index);

    for (const x of xs) {
      if (!m.has(x)) m.set(x, new Set);
      m.get(x).add(index);
    }

    return m;
  }, new Map);

  const index = lunr(function () {
    this.ref('id');
    this.field('text');

    // Colors
    this.add({id: 'black', text: 'black'});
    this.add({id:  'blue', text:  'blue'});
    this.add({id: 'green', text: 'green'});
    this.add({id:   'red', text:   'red'});
    this.add({id: 'white', text: 'white'});

    // Keywords
    (new Set(cards.flatMap(c => c.keywords))).forEach((k) => {
      this.add({id: k, text: k});
    });

    // Types
    (new Set(cards.flatMap(c => c.types))).forEach((t) => {
      this.add({id: t, text: t});
    });

    // Name & Oracle
    cards.forEach(c => {
      this.add({id: c.id, text: `${c.name}\n${c.text}`});
    });
  });

  return fromCallback(({receive, sendBack}) => {
    receive((event) => {
      if (event.type != 'search') return;

      console.log(

        index.search('insect')

      );

      sendBack({
        type:'search.results',
        payload: cards
      });
    });
  });
}

