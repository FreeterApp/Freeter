/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcWidgetDataStorageClearArgs, ipcWidgetDataStorageClearChannel, IpcWidgetDataStorageClearRes, IpcWidgetDataStorageDeleteArgs, ipcWidgetDataStorageDeleteChannel, IpcWidgetDataStorageDeleteRes, IpcWidgetDataStorageGetKeysArgs, ipcWidgetDataStorageGetKeysChannel, IpcWidgetDataStorageGetKeysRes, IpcWidgetDataStorageGetTextArgs, ipcWidgetDataStorageGetTextChannel, IpcWidgetDataStorageGetTextRes, IpcWidgetDataStorageSetTextArgs, ipcWidgetDataStorageSetTextChannel, IpcWidgetDataStorageSetTextRes } from '@common/ipc/channels';
import { DataStorage } from '@common/application/interfaces/dataStorage';
import { electronIpcRenderer } from '@/infra/globals';

export function createWidgetDataStorage(widgetId: string): DataStorage {
  return {
    getText: async (key) => electronIpcRenderer.invoke<IpcWidgetDataStorageGetTextArgs, IpcWidgetDataStorageGetTextRes>
      (
        ipcWidgetDataStorageGetTextChannel,
        widgetId,
        key
      ),
    setText: async (key, text) => electronIpcRenderer.invoke<IpcWidgetDataStorageSetTextArgs, IpcWidgetDataStorageSetTextRes>
      (
        ipcWidgetDataStorageSetTextChannel,
        widgetId,
        key,
        text
      ),
    deleteItem: async (key) => electronIpcRenderer.invoke<IpcWidgetDataStorageDeleteArgs, IpcWidgetDataStorageDeleteRes>
      (
        ipcWidgetDataStorageDeleteChannel,
        widgetId,
        key
      ),
    clear: async () => electronIpcRenderer.invoke<IpcWidgetDataStorageClearArgs, IpcWidgetDataStorageClearRes>
      (
        ipcWidgetDataStorageClearChannel,
        widgetId
      ),
    getKeys: async () => electronIpcRenderer.invoke<IpcWidgetDataStorageGetKeysArgs, IpcWidgetDataStorageGetKeysRes>
      (
        ipcWidgetDataStorageGetKeysChannel,
        widgetId
      )
  }
}
