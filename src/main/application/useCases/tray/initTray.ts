/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { TrayProvider } from '@/application/interfaces/trayProvider';
import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { createShowAppAction } from '@/application/useCases/tray/showAppAction';
import { SetTrayMenuUseCase } from '@/application/useCases/tray/setTrayMenu';

interface Deps {
  trayProvider: TrayProvider;
  setTrayMenuUseCase: SetTrayMenuUseCase;
}

export function createInitTrayUseCase(deps: Deps) {
  const { trayProvider, setTrayMenuUseCase } = deps;
  return function initTrayUseCase(appWindow: BrowserWindow): void {
    const mainAction = createShowAppAction(appWindow);
    trayProvider.setMainAction(mainAction);
    setTrayMenuUseCase([], appWindow);
  }
}

export type InitTrayUseCase = ReturnType<typeof createInitTrayUseCase>;
