/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState, PersistentAppState, initAppStateWidgets, mergeAppStateWithPersistentAppState } from '@/base/state/app';
import { StateStorage } from '@common/data/stateStorage';
import { createStore } from '@common/data/store';

export function createAppStore(
  deps: {
    stateStorage: StateStorage<AppState, PersistentAppState>;
  },
  initialState: AppState,
  onStoreReady?: () => void
) {
  return createStore(
    deps,
    initialState,
    // prep with initAppStateWidgets, because init.ts defines init state with
    // default widgets having empty settings objects
    initAppStateWidgets,
    mergeAppStateWithPersistentAppState,
    onStoreReady
  )
}
