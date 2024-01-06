/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcShowBrowserWindowArgs, ipcShowBrowserWindowChannel, IpcShowBrowserWindowRes } from '@common/ipc/channels';
import { ShowBrowserWindowUseCase } from '@/application/useCases/browserWindow/showBrowserWindow';

type Deps = {
  showBrowserWindowUseCase: ShowBrowserWindowUseCase;
}

export function createBrowserWindowControllers({
  showBrowserWindowUseCase,
}: Deps): [
    Controller<IpcShowBrowserWindowArgs, IpcShowBrowserWindowRes>,
  ] {
  return [{
    channel: ipcShowBrowserWindowChannel,
    handle: async (event) => {
      const win = event.getSenderBrowserWindow();
      if (win) {
        showBrowserWindowUseCase(win);
      }
    }
  }]
}
