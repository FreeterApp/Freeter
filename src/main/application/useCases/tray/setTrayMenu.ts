/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItem, MenuItemIpc, MenuItemsIpc } from '@common/base/menu';
import { TrayProvider } from '@/application/interfaces/trayProvider';
import { createShowAppAction } from '@/application/useCases/tray/showAppAction';
import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { WebContents } from '@/application/interfaces/webContents';

interface Deps {
  trayProvider: TrayProvider;
}

export function createSetTrayMenuUseCase(deps: Deps) {
  const { trayProvider } = deps;
  return async function setTrayMenuUseCase(
    items: ReadonlyArray<MenuItem | MenuItemIpc>,
    windowTarget: BrowserWindow,
    actionsTarget?: WebContents | undefined
  ): Promise<void> {
    const showAppAction = createShowAppAction(windowTarget);
    trayProvider.setMenu([
      {
        doAction: showAppAction,
        label: 'Show Freeter'
      },
      { type: 'separator' },
      ...(items.length > 0
        ? [
          ...items,
          { type: 'separator' }
        ] as MenuItemsIpc
        : []
      ),
      { role: 'quit' }
    ], actionsTarget);
  }
}

export type SetTrayMenuUseCase = ReturnType<typeof createSetTrayMenuUseCase>;
