/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createStateStorage } from '@common/data/stateStorage';
import { createStore } from '@common/data/store';
import { withJson } from '@common/infra/dataStorage/withJson';
import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';

export function fixtureStore<TState extends object>(state: TState): Promise<ReturnType<typeof createStore<TState, TState>>> {
  return new Promise(resolve => {
    const store = createStore<TState, TState>({
      stateStorage: createStateStorage(
        withJson(createInMemoryDataStorage()),
        'state-key',
        1,
        0,
        s => s as TState,
        s => s as TState
      )
    }, state, s => s as TState, s => s as TState, () => {
      resolve(store);
    })
  })
}
