/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateStorage, createStateStorage, appStateDataStoragKey } from '@common/data/stateStorage';
import { DataStorageJson } from '@common/application/interfaces/dataStorage';
import { AppState, createPersistentAppState, currentAppStateVersion, migrateAppState, PersistentAppState } from '@/base/state/app';

export type AppStateStorage = StateStorage<AppState, PersistentAppState>
export function createAppStateStorage(
  dataStorage: DataStorageJson,
): AppStateStorage {
  return createStateStorage(dataStorage, appStateDataStoragKey, currentAppStateVersion, 5000, migrateAppState, createPersistentAppState);
}
