import { emit, setup, createActor, spawnChild, sendTo, enqueueActions} from "xstate";
import search from './search.js';

const sys_search = ({system}) => system.get('search');

const src = setup({
  actions: {
    'emit-results': emit(({event}) => ({
      type: 'results',
      payload: event.payload
    })),

    'filter-color': enqueueActions(({enqueue}) => {
      enqueue.assign(({event, context}) => {
        const {color, exclude = false} = event;
        const key = exclude ? 'exclude_colors' : 'include_colors';
        const val = context[key];
        return {
          [key]: (
            val.includes(color)
              ? val.filter(c => c != color)
              : val.concat(color)
          )
        };
      });

      enqueue.sendTo(sys_search, ({context}) => ({
        type: 'search',
        query: context
      })); 
    }) 
  }
});

const machine = src.createMachine({
  initial: 'init',
  context: {
    include_colors: [],
    exclude_colors: [],
  },
  states: {
    init: {
      entry: 'init',
      after: {
        100: {
          target: 'idle'
        }
      }
    },
    idle: {
      
    }
  },
  on: {
    'filter.color': {
      actions: 'filter-color'
    },
    'search.results': {
      actions: 'emit-results'
    }
  }
});

export default function (cards) {

  const provided = machine.provide({
    actions: {
      init: spawnChild(search(cards), {
        systemId: 'search'
      })
    }
  });

  return createActor(provided);
}

