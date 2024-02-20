/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcPopupOsContextMenuArgs, IpcPopupOsContextMenuRes, ipcPopupOsContextMenuChannel } from '@common/ipc/channels';
import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { ClickContextMenuItemUseCase } from '@/application/useCases/contextMenu/clickContextMenuItem';

interface Deps {
  clickContextMenuItemUseCase: ClickContextMenuItemUseCase;
}

export function createOsContextMenuProvider({ clickContextMenuItemUseCase }: Deps): ContextMenuProvider {
  return {
    show: async (items) => {
      if (items.length < 1) {
        return;
      }

      const [itemsIpc, menuItemsByActionId] = prepareMenuItemsForIpc(items);
      const actionId = await electronIpcRenderer.invoke<IpcPopupOsContextMenuArgs, IpcPopupOsContextMenuRes>(
        ipcPopupOsContextMenuChannel,
        itemsIpc
      )
      if (actionId !== undefined) {
        clickContextMenuItemUseCase(menuItemsByActionId[actionId]);
      }
    }
  }
}
