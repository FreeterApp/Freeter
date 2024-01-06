/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClearWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/clearWidgetDataStorage';
import { DeleteInWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/deleteInWidgetDataStorage';
import { GetKeysFromWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/getKeysFromWidgetDataStorage';
import { GetTextFromWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/getTextFromWidgetDataStorage';
import { SetTextInWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/setTextInWidgetDataStorage';
import { Controller } from '@/controllers/controller';
import { IpcWidgetDataStorageClearArgs, ipcWidgetDataStorageClearChannel, IpcWidgetDataStorageClearRes, IpcWidgetDataStorageDeleteArgs, ipcWidgetDataStorageDeleteChannel, IpcWidgetDataStorageDeleteRes, IpcWidgetDataStorageGetKeysArgs, ipcWidgetDataStorageGetKeysChannel, IpcWidgetDataStorageGetKeysRes, IpcWidgetDataStorageGetTextArgs, ipcWidgetDataStorageGetTextChannel, IpcWidgetDataStorageGetTextRes, IpcWidgetDataStorageSetTextArgs, ipcWidgetDataStorageSetTextChannel, IpcWidgetDataStorageSetTextRes } from '@common/ipc/channels';

type Deps = {
  getTextFromWidgetDataStorageUseCase: GetTextFromWidgetDataStorageUseCase;
  setTextInWidgetDataStorageUseCase: SetTextInWidgetDataStorageUseCase;
  deleteInWidgetDataStorageUseCase: DeleteInWidgetDataStorageUseCase;
  clearWidgetDataStorageUseCase: ClearWidgetDataStorageUseCase;
  getKeysFromWidgetDataStorageUseCase: GetKeysFromWidgetDataStorageUseCase;
}

export function createWidgetDataStorageControllers({
  getTextFromWidgetDataStorageUseCase,
  setTextInWidgetDataStorageUseCase,
  clearWidgetDataStorageUseCase,
  deleteInWidgetDataStorageUseCase,
  getKeysFromWidgetDataStorageUseCase,
}: Deps): [
    Controller<IpcWidgetDataStorageGetTextArgs, IpcWidgetDataStorageGetTextRes>,
    Controller<IpcWidgetDataStorageSetTextArgs, IpcWidgetDataStorageSetTextRes>,
    Controller<IpcWidgetDataStorageDeleteArgs, IpcWidgetDataStorageDeleteRes>,
    Controller<IpcWidgetDataStorageClearArgs, IpcWidgetDataStorageClearRes>,
    Controller<IpcWidgetDataStorageGetKeysArgs, IpcWidgetDataStorageGetKeysRes>,
  ] {
  return [{
    channel: ipcWidgetDataStorageGetTextChannel,
    handle: async (_event, widgetId, key) => getTextFromWidgetDataStorageUseCase(widgetId, key)
  }, {
    channel: ipcWidgetDataStorageSetTextChannel,
    handle: async (_event, widgetId, key, text) => setTextInWidgetDataStorageUseCase(widgetId, key, text)
  }, {
    channel: ipcWidgetDataStorageDeleteChannel,
    handle: async (_event, widgetId, key) => deleteInWidgetDataStorageUseCase(widgetId, key)
  }, {
    channel: ipcWidgetDataStorageClearChannel,
    handle: async (_event, widgetId) => clearWidgetDataStorageUseCase(widgetId)
  }, {
    channel: ipcWidgetDataStorageGetKeysChannel,
    handle: async (_event, widgetId) => getKeysFromWidgetDataStorageUseCase(widgetId)
  }]
}
