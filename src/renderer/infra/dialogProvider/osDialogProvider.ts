/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowOsMessageBoxChannel, IpcShowOsMessageBoxArgs, IpcShowOsMessageBoxRes, IpcShowOsOpenFileDialogArgs, IpcShowOsOpenFileDialogRes, ipcShowOsOpenFileDialogChannel, IpcShowOsSaveFileDialogArgs, IpcShowOsSaveFileDialogRes, ipcShowOsSaveFileDialogChannel, IpcShowOsOpenDirDialogArgs, IpcShowOsOpenDirDialogRes, ipcShowOsOpenDirDialogChannel } from '@common/ipc/channels';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

export function createOsDialogProvider(): DialogProvider {
  return {
    showMessageBox: (config) => electronIpcRenderer.invoke<IpcShowOsMessageBoxArgs, IpcShowOsMessageBoxRes>(
      ipcShowOsMessageBoxChannel,
      config
    ),
    showOpenFileDialog: (config) => electronIpcRenderer.invoke<IpcShowOsOpenFileDialogArgs, IpcShowOsOpenFileDialogRes>(
      ipcShowOsOpenFileDialogChannel,
      config
    ),
    showSaveFileDialog: (config) => electronIpcRenderer.invoke<IpcShowOsSaveFileDialogArgs, IpcShowOsSaveFileDialogRes>(
      ipcShowOsSaveFileDialogChannel,
      config
    ),
    showOpenDirDialog: (config) => electronIpcRenderer.invoke<IpcShowOsOpenDirDialogArgs, IpcShowOsOpenDirDialogRes>(
      ipcShowOsOpenDirDialogChannel,
      config
    ),
  }
}
