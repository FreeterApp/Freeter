/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcAppDataStorageClearArgs, ipcAppDataStorageClearChannel, IpcAppDataStorageClearRes, IpcAppDataStorageDeleteArgs, ipcAppDataStorageDeleteChannel, IpcAppDataStorageDeleteRes, IpcAppDataStorageGetKeysArgs, ipcAppDataStorageGetKeysChannel, IpcAppDataStorageGetKeysRes, IpcAppDataStorageGetTextArgs, ipcAppDataStorageGetTextChannel, IpcAppDataStorageGetTextRes, IpcAppDataStorageSetTextArgs, ipcAppDataStorageSetTextChannel, IpcAppDataStorageSetTextRes } from '@common/ipc/channels';
import { DataStorage } from '@common/application/interfaces/dataStorage';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

export function createAppDataStorage(): DataStorage {
  return {
    getText: async (key) => electronIpcRenderer.invoke<IpcAppDataStorageGetTextArgs, IpcAppDataStorageGetTextRes>
      (
        ipcAppDataStorageGetTextChannel,
        key
      ),
    setText: async (key, text) => electronIpcRenderer.invoke<IpcAppDataStorageSetTextArgs, IpcAppDataStorageSetTextRes>
      (
        ipcAppDataStorageSetTextChannel,
        key,
        text
      ),
    deleteItem: async (key) => electronIpcRenderer.invoke<IpcAppDataStorageDeleteArgs, IpcAppDataStorageDeleteRes>
      (
        ipcAppDataStorageDeleteChannel,
        key
      ),
    clear: async () => electronIpcRenderer.invoke<IpcAppDataStorageClearArgs, IpcAppDataStorageClearRes>
      (
        ipcAppDataStorageClearChannel
      ),
    getKeys: async () => electronIpcRenderer.invoke<IpcAppDataStorageGetKeysArgs, IpcAppDataStorageGetKeysRes>
      (
        ipcAppDataStorageGetKeysChannel
      )
  }
}
