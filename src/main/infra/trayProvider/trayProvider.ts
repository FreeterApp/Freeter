/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { TrayProvider } from '@/application/interfaces/trayProvider';
import { createElectronMenuFromMenuItemsAndIpc } from '@/infra/utils/menu';
import { IpcClickTrayMenuActionArgs, ipcClickTrayMenuActionChannel } from '@common/ipc/channels';

export function createTrayProvider(trayIcon: string): TrayProvider {
  const tray = new Electron.Tray(trayIcon);
  tray.setToolTip('Freeter');

  let prevMainAction: (() => void) | null = null;

  return {
    setMenu: (items, actionsTarget) => {
      const contextMenu = createElectronMenuFromMenuItemsAndIpc(items, actionsTarget ? actionId => {
        type ElectronSend = typeof actionsTarget.send;
        type SendIpcClickTrayMenuAction = (channel: Parameters<ElectronSend>[0], ...args: IpcClickTrayMenuActionArgs) => void;
        (<SendIpcClickTrayMenuAction>actionsTarget.send)(ipcClickTrayMenuActionChannel, actionId);
      } : () => undefined);
      tray.setContextMenu(contextMenu);
    },
    setMainAction: (action) => {
      if (prevMainAction) {
        tray.removeListener('balloon-click', prevMainAction);
        tray.removeListener('click', prevMainAction);
        prevMainAction = null;
      }
      if (action) {
        tray.on('balloon-click', action);
        tray.on('click', action);
        prevMainAction = action;
      }
    }
  }
}
