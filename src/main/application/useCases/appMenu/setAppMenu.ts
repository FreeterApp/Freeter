/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { MenuItemsIpc } from '@common/base/menu';
import { WebContents } from '@/application/interfaces/webContents';

interface Deps {
  appMenuProvider: AppMenuProvider;
}

export function createSetAppMenuUseCase(deps: Deps) {
  const { appMenuProvider } = deps;
  return async function setAppMenuUseCase(items: MenuItemsIpc, actionsTarget: WebContents): Promise<void> {
    appMenuProvider.setMenu(items, actionsTarget);
  }
}

export type SetAppMenuUseCase = ReturnType<typeof createSetAppMenuUseCase>;
