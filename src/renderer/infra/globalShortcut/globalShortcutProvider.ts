/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcSetMainShortcutArgs, IpcSetMainShortcutRes, ipcSetMainShortcutChannel } from '@common/ipc/channels';
import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';
import { electronIpcRenderer } from '@/infra/globals';

export function createGlobalShortcutProvider(): GlobalShortcutProvider {
  return {
    setMainShortcut: async (accelerator) => electronIpcRenderer.invoke<IpcSetMainShortcutArgs, IpcSetMainShortcutRes>(
      ipcSetMainShortcutChannel,
      accelerator
    )
  }
}
