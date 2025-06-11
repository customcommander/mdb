import { emit, setup, createActor, spawnChild, log, enqueueActions} from "xstate";
import search from './search.js';

const sys_search = ({system}) => system.get('search');

const src = setup({
  actions: {
    'emit-results': emit(({event}) => ({
      type: 'results',
      payload: event.payload
    })),

    'emit-state-change': emit(({event}) => ({
      type: 'state.change',
      state: event.type,
      value: event.value
    })),

    'filter-color': enqueueActions(({enqueue}) => {
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
    },
    'display': {
      actions: 'emit-state-change'
    },
  },
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

