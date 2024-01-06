/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateInStore, Store } from '@common/application/interfaces/store';
import { StateStorage } from '@common/data/stateStorage';
import { createStore as zustandCreateStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/vanilla/shallow';

export function createStore<TState extends object, TPersistentState extends object>(
  deps: {
    stateStorage: StateStorage<TState, TPersistentState>;
  },
  initialState: TState,
  prepareState: (state: StateInStore<TState>) => StateInStore<TState>,
  mergeState: (state: TState, persistentState: TPersistentState) => TState,
  onStoreReady?: () => void
) {
  const { stateStorage } = deps;

  const zustandStore = zustandCreateStore(
    subscribeWithSelector(
      () => prepareState({ ...initialState, isLoading: true })
    )
  );
  const { getState, setState, subscribe } = zustandStore;

  let isLoaded = false;
  stateStorage.loadState()
    .then(loadedState => {
      let state: TState;
      if (loadedState !== null) {
        state = mergeState(initialState, loadedState);
      } else {
        state = initialState;
      }
      setState(prepareState(state), true);

      isLoaded = true;
      if (onStoreReady) {
        onStoreReady();
      }
    })

  const store: Store<TState> = {
    get: getState,
    set: state => {
      if (isLoaded) {
        setState(state);
        stateStorage.saveState(state);
      }
    },
    subscribe: (selector, listener, options) => subscribe(selector, listener, { ...options, equalityFn: shallow }),
    subscribeWithStrictEq: subscribe,
    subscribeWithCustomEq: subscribe
  }

  return [
    store,
    zustandStore
  ] as const;
}

