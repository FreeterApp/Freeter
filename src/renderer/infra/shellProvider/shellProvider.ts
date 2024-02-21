/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcShellOpenExternalUrlArgs, ipcShellOpenExternalUrlChannel, IpcShellOpenExternalUrlRes, IpcShellOpenPathArgs, ipcShellOpenPathChannel, IpcShellOpenPathRes } from '@common/ipc/channels';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { ShellProvider } from '@/application/interfaces/shellProvider';

export function createShellProvider(): ShellProvider {
  return {
    openExternal: (url) => electronIpcRenderer.invoke<IpcShellOpenExternalUrlArgs, IpcShellOpenExternalUrlRes>(
      ipcShellOpenExternalUrlChannel,
      url
    ),
    openPath: (path) => electronIpcRenderer.invoke<IpcShellOpenPathArgs, IpcShellOpenPathRes>(
      ipcShellOpenPathChannel,
      path
    ),
  }
}
