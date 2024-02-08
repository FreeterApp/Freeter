/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcClickTrayMenuActionArgs, IpcSetTrayMenuArgs, IpcSetTrayMenuRes, ipcClickTrayMenuActionChannel, ipcSetTrayMenuChannel } from '@common/ipc/channels';
import { TrayMenuProvider } from '@/application/interfaces/trayMenuProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { ClickTrayMenuItemUseCase } from '@/application/useCases/trayMenu/clickTrayMenuItem';
import { MenuItem } from '@common/base/menu';

interface Deps {
  clickTrayMenuItemUseCase: ClickTrayMenuItemUseCase;
}

export function createTrayMenuProvider({ clickTrayMenuItemUseCase }: Deps): TrayMenuProvider {
  let _menuItemsByActionId: MenuItem[] = [];
  electronIpcRenderer.on<IpcClickTrayMenuActionArgs>(ipcClickTrayMenuActionChannel, (actionId) => {
    clickTrayMenuItemUseCase(_menuItemsByActionId[actionId]);
  })
  return {
    setMenu: async (items) => {
      const [itemsIpc, menuItemsByActionId] = prepareMenuItemsForIpc(items);
      await electronIpcRenderer.invoke<IpcSetTrayMenuArgs, IpcSetTrayMenuRes>(
        ipcSetTrayMenuChannel,
        itemsIpc
      )
      _menuItemsByActionId = menuItemsByActionId;
    },
  }
}
