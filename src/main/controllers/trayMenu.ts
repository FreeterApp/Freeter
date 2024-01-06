/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcSetTrayMenuArgs, ipcSetTrayMenuChannel, IpcSetTrayMenuRes } from '@common/ipc/channels';
import { SetTrayMenuUseCase } from '@/application/useCases/tray/setTrayMenu';

type Deps = {
  setTrayMenuUseCase: SetTrayMenuUseCase;
}

export function createTrayMenuControllers({
  setTrayMenuUseCase,
}: Deps): [
    Controller<IpcSetTrayMenuArgs, IpcSetTrayMenuRes>,
  ] {
  return [{
    channel: ipcSetTrayMenuChannel,
    handle: async (event, items) => {
      const win = event.getSenderBrowserWindow();
      const { sender } = event;
      if (win) {
        setTrayMenuUseCase(items, win, sender);
      }
    }
  }]
}
