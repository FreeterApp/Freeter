/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WindowState, PersistentWindowState, prepareWindowState, mergeWindowStateWithPersistentWindowState } from '@/base/state/window';
import { StateStorage } from '@common/data/stateStorage';
import { createStore } from '@common/data/store';

export function createWindowStore(
  deps: {
    stateStorage: StateStorage<WindowState, PersistentWindowState>;
  },
  initialState: WindowState,
  onStoreReady?: () => void
) {
  return createStore(
    deps,
    initialState,
    prepareWindowState,
    mergeWindowStateWithPersistentWindowState,
    onStoreReady
  )
}
