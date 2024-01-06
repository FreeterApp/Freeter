/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcSetAppMenuArgs, IpcSetAppMenuAutoHideArgs, ipcSetAppMenuAutoHideChannel, IpcSetAppMenuAutoHideRes, ipcSetAppMenuChannel, IpcSetAppMenuRes } from '@common/ipc/channels';
import { SetAppMenuUseCase } from '@/application/useCases/appMenu/setAppMenu';
import { SetAppMenuAutoHideUseCase } from '@/application/useCases/appMenu/setAppMenuAutoHide';

type Deps = {
  setAppMenuUseCase: SetAppMenuUseCase;
  setAppMenuAutoHideUseCase: SetAppMenuAutoHideUseCase;
}

export function createAppMenuControllers({
  setAppMenuUseCase,
  setAppMenuAutoHideUseCase,
}: Deps): [
    Controller<IpcSetAppMenuArgs, IpcSetAppMenuRes>,
    Controller<IpcSetAppMenuAutoHideArgs, IpcSetAppMenuAutoHideRes>,
  ] {
  return [{
    channel: ipcSetAppMenuChannel,
    handle: async (event, menuItemsIpc) => {
      const { sender } = event;
      setAppMenuUseCase(menuItemsIpc, sender);
    }
  }, {
    channel: ipcSetAppMenuAutoHideChannel,
    handle: async (event, autoHide) => {
      const win = event.getSenderBrowserWindow();
      if (win) {
        setAppMenuAutoHideUseCase(autoHide, win);
      }
    }
  }]
}
