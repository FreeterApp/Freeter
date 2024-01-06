/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';

export function createShowBrowserWindowUseCase() {
  return function showBrowserWindowUseCase(browserWindow: BrowserWindow) {
    return browserWindow.show();
  }
}

export type ShowBrowserWindowUseCase = ReturnType<typeof createShowBrowserWindowUseCase>;
