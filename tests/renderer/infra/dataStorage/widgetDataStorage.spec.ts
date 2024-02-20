/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcWidgetDataStorageClearChannel, ipcWidgetDataStorageDeleteChannel, ipcWidgetDataStorageGetKeysChannel, ipcWidgetDataStorageGetTextChannel, ipcWidgetDataStorageSetTextChannel } from '@common/ipc/channels';
import { createWidgetDataStorage } from '@/infra/dataStorage/widgetDataStorage';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

jest.mock('@/infra/mainApi/mainApi');

describe('WidgetDataStorage', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('getText', () => {
    it('should send a message to the main process via a right channel with right args and return the result', async () => {
      const widgetId = 'widget-id';
      const res = 'result';
      const key = 'test-key';
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);
      const dataStorage = createWidgetDataStorage(widgetId);

      const gotRes = await dataStorage.getText(key);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWidgetDataStorageGetTextChannel, widgetId, key);
      expect(gotRes).toBe(res);
    })
  })

  describe('setText', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const widgetId = 'widget-id';
      const key = 'test-key';
      const data = 'some data';
      const dataStorage = createWidgetDataStorage(widgetId);

      await dataStorage.setText(key, data);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWidgetDataStorageSetTextChannel, widgetId, key, data);
    })
  })

  describe('deleteItem', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const widgetId = 'widget-id';
      const key = 'test-key';
      const dataStorage = createWidgetDataStorage(widgetId);

      await dataStorage.deleteItem(key);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWidgetDataStorageDeleteChannel, widgetId, key);
    })
  })

  describe('clear', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const widgetId = 'widget-id';
      const dataStorage = createWidgetDataStorage(widgetId);

      await dataStorage.clear();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWidgetDataStorageClearChannel, widgetId);
    })
  })

  describe('getKeys', () => {
    it('should send a message to the main process via a right channel with right args', async () => {
      const widgetId = 'widget-id';
      const res = 'result';
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);
      const dataStorage = createWidgetDataStorage(widgetId);

      const gotRes = await dataStorage.getKeys();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWidgetDataStorageGetKeysChannel, widgetId);
      expect(gotRes).toBe(res);
    })
  })
})
