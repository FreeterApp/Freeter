/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcAppDataStorageClearChannel, ipcAppDataStorageDeleteChannel, ipcAppDataStorageGetKeysChannel, ipcAppDataStorageGetTextChannel, ipcAppDataStorageSetTextChannel } from '@common/ipc/channels';
import { createAppDataStorage } from '@/infra/dataStorage/appDataStorage';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

jest.mock('@/infra/mainApi/mainApi');

describe('AppDataStorage', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('getText', () => {
    it('should send a message to the main process via a right channel with right args and return the result', async () => {
      const res = 'result';
      const key = 'test-key';
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);
      const dataStorage = createAppDataStorage();

      const gotRes = await dataStorage.getText(key);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcAppDataStorageGetTextChannel, key);
      expect(gotRes).toBe(res);
    })
  })

  describe('setText', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const key = 'test-key';
      const data = 'some data';
      const dataStorage = createAppDataStorage();

      await dataStorage.setText(key, data);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcAppDataStorageSetTextChannel, key, data);
    })
  })

  describe('deleteItem', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const key = 'test-key';
      const dataStorage = createAppDataStorage();

      await dataStorage.deleteItem(key);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcAppDataStorageDeleteChannel, key);
    })
  })

  describe('clear', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const dataStorage = createAppDataStorage();

      await dataStorage.clear();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcAppDataStorageClearChannel);
    })
  })

  describe('getKeys', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const res = 'result';
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);
      const dataStorage = createAppDataStorage();

      const gotRes = await dataStorage.getKeys();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcAppDataStorageGetKeysChannel);
      expect(gotRes).toBe(res);
    })
  })
})
