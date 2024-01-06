/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateStorage, createStateStorage, appStateDataStoragKey } from '@common/data/stateStorage';
import { createPersistentAppState, currentAppStateVersion, migrateAppState } from '@/base/state/app';
import { createAppStateStorage } from '@/data/appStateStorage'
import { DataStorageJson } from '@common/application/interfaces/dataStorage';

jest.mock('@common/data/stateStorage');
const mockedCreateStateStorage = jest.mocked(createStateStorage);

beforeEach(() => {
  jest.resetAllMocks()
})

describe('AppStateStorage', () => {
  describe('createAppStateStorage', () => {
    it('should call createStateStorage with right params and return its value', async () => {
      const dataStorage = { 'data': 'storage' } as unknown as DataStorageJson;
      const retVal = 'value' as unknown as StateStorage<object, object>;
      mockedCreateStateStorage.mockImplementation(() => retVal);

      const gotVal = createAppStateStorage(dataStorage);
      expect(mockedCreateStateStorage).toBeCalledTimes(1);
      expect(mockedCreateStateStorage).toBeCalledWith(
        dataStorage,
        appStateDataStoragKey,
        currentAppStateVersion,
        5000,
        migrateAppState,
        createPersistentAppState
      );
      expect(gotVal).toBe(retVal);
    })
  })
})
