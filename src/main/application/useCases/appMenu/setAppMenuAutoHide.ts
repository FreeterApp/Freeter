/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppMenuProvider } from '@/application/interfaces/appMenuProvider';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

interface Deps {
  appMenuProvider: AppMenuProvider;
}

export function createSetAppMenuAutoHideUseCase(deps: Deps) {
  const { appMenuProvider } = deps;
  return async function setAppMenuAutoHideUseCase(autoHide: boolean, windowTarget: BrowserWindow): Promise<void> {
    appMenuProvider.setAutoHide(autoHide, windowTarget);
  }
}

export type SetAppMenuAutoHideUseCase = ReturnType<typeof createSetAppMenuAutoHideUseCase>;
