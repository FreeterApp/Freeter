/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcShowOsMessageBoxArgs, ipcShowOsMessageBoxChannel, IpcShowOsMessageBoxRes, IpcShowOsOpenDirDialogArgs, ipcShowOsOpenDirDialogChannel, IpcShowOsOpenDirDialogRes, IpcShowOsOpenFileDialogArgs, ipcShowOsOpenFileDialogChannel, IpcShowOsOpenFileDialogRes, IpcShowOsSaveFileDialogArgs, ipcShowOsSaveFileDialogChannel, IpcShowOsSaveFileDialogRes } from '@common/ipc/channels';
import { ShowMessageBoxUseCase } from '@/application/useCases/dialog/showMessageBox';
import { ShowOpenFileDialogUseCase } from '@/application/useCases/dialog/showOpenFileDialog';
import { ShowSaveFileDialogUseCase } from '@/application/useCases/dialog/showSaveFileDialog';
import { ShowOpenDirDialogUseCase } from '@/application/useCases/dialog/showOpenDirDialog';

type Deps = {
  showMessageBoxUseCase: ShowMessageBoxUseCase;
  showOpenFileDialogUseCase: ShowOpenFileDialogUseCase;
  showSaveFileDialogUseCase: ShowSaveFileDialogUseCase;
  showOpenDirDialogUseCase: ShowOpenDirDialogUseCase;
}

export function createDialogControllers({
  showMessageBoxUseCase,
  showOpenFileDialogUseCase,
  showSaveFileDialogUseCase,
  showOpenDirDialogUseCase,
}: Deps): [
    Controller<IpcShowOsMessageBoxArgs, IpcShowOsMessageBoxRes>,
    Controller<IpcShowOsOpenFileDialogArgs, IpcShowOsOpenFileDialogRes>,
    Controller<IpcShowOsSaveFileDialogArgs, IpcShowOsSaveFileDialogRes>,
    Controller<IpcShowOsOpenDirDialogArgs, IpcShowOsOpenDirDialogRes>,
  ] {
  return [{
    channel: ipcShowOsMessageBoxChannel,
    handle: async (event, config) => showMessageBoxUseCase(event.getSenderBrowserWindow(), config)
  }, {
    channel: ipcShowOsOpenFileDialogChannel,
    handle: async (event, config) => showOpenFileDialogUseCase(event.getSenderBrowserWindow(), config)
  }, {
    channel: ipcShowOsSaveFileDialogChannel,
    handle: async (event, config) => showSaveFileDialogUseCase(event.getSenderBrowserWindow(), config)
  }, {
    channel: ipcShowOsOpenDirDialogChannel,
    handle: async (event, config) => showOpenDirDialogUseCase(event.getSenderBrowserWindow(), config)
  }]
}
