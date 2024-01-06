/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateStorage, createStateStorage, windowStateDataStoragKey } from '@common/data/stateStorage';
import { DataStorageJson } from '@common/application/interfaces/dataStorage';
import { WindowState, createPersistentWindowState, currentWindowStateVersion, migrateWindowState, PersistentWindowState } from '@/base/state/window';

export type WindowStateStorage = StateStorage<WindowState, PersistentWindowState>
export function createWindowStateStorage(
  dataStorage: DataStorageJson,
): WindowStateStorage {
  return createStateStorage(dataStorage, windowStateDataStoragKey, currentWindowStateVersion, 5000, migrateWindowState, createPersistentWindowState);
}
