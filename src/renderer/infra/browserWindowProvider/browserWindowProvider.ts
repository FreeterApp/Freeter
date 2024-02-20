/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcShowBrowserWindowArgs, IpcShowBrowserWindowRes, ipcShowBrowserWindowChannel } from '@common/ipc/channels';
import { BrowserWindowProvider } from '@/application/interfaces/browserWindowProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

export function createBrowserWindowProvider(): BrowserWindowProvider {
  return {
    show: async () => {
      electronIpcRenderer.invoke<IpcShowBrowserWindowArgs, IpcShowBrowserWindowRes>(
        ipcShowBrowserWindowChannel
      )
    }
  }
}
