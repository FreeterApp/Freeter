/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createVersionedObject, isVersionedObject, MigrateVersionedObject, unwrapVersionedObject } from '@common/base/versionedObject';
import { debounce } from '@common/helpers/debounce';
import { DataStorageJson } from '@common/application/interfaces/dataStorage';

export const appStateDataStoragKey = 'app';
export const windowStateDataStoragKey = 'window';

export interface StateStorage<TState extends object, TPersistentState extends object> {
  loadState(): Promise<TPersistentState | null>;
  saveState(state: TState): void;
}

export function createStateStorage<TState extends object, TPersistentState extends object>(
  dataStorage: DataStorageJson,
  stateDataStoragKey: string,
  version: number,
  debounceMsec: number,
  migrate: MigrateVersionedObject<object, TPersistentState>,
  persistentStateFactory: (state: TState) => TPersistentState
): StateStorage<TState, TPersistentState> {
  const saveState = (state: TState) => {
    dataStorage.setJson(stateDataStoragKey, createVersionedObject(persistentStateFactory(state), version));
  }
  return {
    async loadState() {
      const gotData = await dataStorage.getJson(stateDataStoragKey);
      if (!gotData || !isVersionedObject(gotData)) {
        return null;
      }
      // TODO: validate PersistentState data
      return unwrapVersionedObject(gotData, version, migrate)
    },
    saveState: debounceMsec > 0 ? debounce(saveState, 5000) : saveState
  }
}
