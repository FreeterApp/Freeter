/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { ipcSetMainShortcutChannel, IpcSetMainShortcutRes, IpcSetMainShortcutArgs } from '@common/ipc/channels';
import { SetMainShortcutUseCase } from '@/application/useCases/globalShortcut/setMainShortcut';

type Deps = {
  setMainShortcutUseCase: SetMainShortcutUseCase;
}

export function createGlobalShortcutControllers({
  setMainShortcutUseCase,
}: Deps): [
    Controller<IpcSetMainShortcutArgs, IpcSetMainShortcutRes>,
  ] {
  return [{
    channel: ipcSetMainShortcutChannel,
    handle: async (event, accelerator) => {
      const win = event.getSenderBrowserWindow();
      if (win) {
        return setMainShortcutUseCase(accelerator, win);
      }
      return false;
    }
  }]
}
