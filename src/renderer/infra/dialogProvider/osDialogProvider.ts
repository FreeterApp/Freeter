/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowOsMessageBoxChannel, IpcShowOsMessageBoxArgs, IpcShowOsMessageBoxRes } from '@common/ipc/channels';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { electronIpcRenderer } from '@/infra/globals';

export function createOsDialogProvider(): DialogProvider {
  return {
    showMessageBox: (config) => electronIpcRenderer.invoke<IpcShowOsMessageBoxArgs, IpcShowOsMessageBoxRes>(
      ipcShowOsMessageBoxChannel,
      config
    )
  }
}
