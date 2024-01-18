/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateStorage, createStateStorage, windowStateDataStoragKey } from '@common/data/stateStorage';
import { createPersistentWindowState, currentWindowStateVersion, migrateWindowState } from '@/base/state/window';
import { createWindowStateStorage } from '@/data/windowStateStorage'
import { DataStorageJson } from '@common/application/interfaces/dataStorage';

jest.mock('@common/data/stateStorage');
const mockedCreateStateStorage = jest.mocked(createStateStorage);

beforeEach(() => {
  jest.resetAllMocks()
})

describe('WindowStateStorage', () => {
  describe('createWindowStateStorage', () => {
    it('should call createStateStorage with right params and return its value', async () => {
      const dataStorage = { 'data': 'storage' } as unknown as DataStorageJson;
      const retVal = 'value' as unknown as StateStorage<object, object>;
      mockedCreateStateStorage.mockImplementation(() => retVal);

      const gotVal = createWindowStateStorage(dataStorage);
      expect(mockedCreateStateStorage).toBeCalledTimes(1);
      expect(mockedCreateStateStorage).toBeCalledWith(
        dataStorage,
        windowStateDataStoragKey,
        currentWindowStateVersion,
        5000,
        migrateWindowState,
        createPersistentWindowState
      );
      expect(gotVal).toBe(retVal);
    })
  })
})
