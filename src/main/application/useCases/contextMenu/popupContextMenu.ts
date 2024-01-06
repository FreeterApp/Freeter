/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { MenuItemsIpc } from '@common/base/menu';

interface Deps {
  contextMenuProvider: ContextMenuProvider;
}

export function createPopupContextMenuUseCase(deps: Deps) {
  const { contextMenuProvider } = deps;
  return async function popupContextMenuUseCase(items: MenuItemsIpc): Promise<number | undefined> {
    return contextMenuProvider.popup(items);
  }
}

export type PopupContextMenuUseCase = ReturnType<typeof createPopupContextMenuUseCase>;
