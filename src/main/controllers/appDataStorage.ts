/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { GetTextFromAppDataStorageUseCase } from '@/application/useCases/appDataStorage/getTextFromAppDataStorage';
import { SetTextInAppDataStorageUseCase } from '@/application/useCases/appDataStorage/setTextInAppDataStorage';
import { Controller } from '@/controllers/controller';
import { IpcAppDataStorageGetTextArgs, ipcAppDataStorageGetTextChannel, IpcAppDataStorageGetTextRes, IpcAppDataStorageSetTextArgs, ipcAppDataStorageSetTextChannel, IpcAppDataStorageSetTextRes } from '@common/ipc/channels';

type Deps = {
  getTextFromAppDataStorageUseCase: GetTextFromAppDataStorageUseCase;
  setTextInAppDataStorageUseCase: SetTextInAppDataStorageUseCase;
}

export function createAppDataStorageControllers({
  getTextFromAppDataStorageUseCase,
  setTextInAppDataStorageUseCase,
}: Deps): [
    Controller<IpcAppDataStorageGetTextArgs, IpcAppDataStorageGetTextRes>,
    Controller<IpcAppDataStorageSetTextArgs, IpcAppDataStorageSetTextRes>,
  ] {
  return [{
    channel: ipcAppDataStorageGetTextChannel,
    handle: async (_event, key) => getTextFromAppDataStorageUseCase(key)
  }, {
    channel: ipcAppDataStorageSetTextChannel,
    handle: async (_event, key, text) => setTextInAppDataStorageUseCase(key, text)
  }]
}
