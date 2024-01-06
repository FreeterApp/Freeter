/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcClickAppMenuActionArgs, IpcSetAppMenuArgs, IpcSetAppMenuAutoHideArgs, IpcSetAppMenuAutoHideRes, IpcSetAppMenuRes, ipcClickAppMenuActionChannel, ipcSetAppMenuAutoHideChannel, ipcSetAppMenuChannel } from '@common/ipc/channels';
import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { electronIpcRenderer } from '@/infra/globals';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { ClickAppMenuItemUseCase } from '@/application/useCases/appMenu/clickAppMenuItem';
import { MenuItem } from '@common/base/menu';

interface Deps {
  clickAppMenuItemUseCase: ClickAppMenuItemUseCase;
}

export function createAppMenuProvider({ clickAppMenuItemUseCase }: Deps): AppMenuProvider {
  let _menuItemsByActionId: MenuItem[] = [];
  electronIpcRenderer.on<IpcClickAppMenuActionArgs>(ipcClickAppMenuActionChannel, (actionId) => {
    clickAppMenuItemUseCase(_menuItemsByActionId[actionId]);
  })
  return {
    setMenu: async (items) => {
      const [itemsIpc, menuItemsByActionId] = prepareMenuItemsForIpc(items);
      await electronIpcRenderer.invoke<IpcSetAppMenuArgs, IpcSetAppMenuRes>(
        ipcSetAppMenuChannel,
        itemsIpc
      )
      _menuItemsByActionId = menuItemsByActionId;
    },
    setAutoHide: async (autoHide) => {
      await electronIpcRenderer.invoke<IpcSetAppMenuAutoHideArgs, IpcSetAppMenuAutoHideRes>(
        ipcSetAppMenuAutoHideChannel,
        autoHide
      )
    }
  }
}
