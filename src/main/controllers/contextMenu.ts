/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcPopupOsContextMenuArgs, ipcPopupOsContextMenuChannel, IpcPopupOsContextMenuRes } from '@common/ipc/channels';
import { PopupContextMenuUseCase } from '@/application/useCases/contextMenu/popupContextMenu';

type Deps = {
  popupContextMenuUseCase: PopupContextMenuUseCase;
}

export function createContextMenuControllers({
  popupContextMenuUseCase,
}: Deps): [
    Controller<IpcPopupOsContextMenuArgs, IpcPopupOsContextMenuRes>,
  ] {
  return [{
    channel: ipcPopupOsContextMenuChannel,
    handle: async (_event, menuItemsIpc) => popupContextMenuUseCase(menuItemsIpc)
  }]
}
