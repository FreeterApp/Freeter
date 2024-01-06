/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindowProvider } from '@/application/interfaces/browserWindowProvider';

type Deps = {
  browserWindow: BrowserWindowProvider;
}

export function createShowBrowserWindowUseCase({
  browserWindow
}: Deps) {
  const showBrowserWindowUseCase = () => {
    browserWindow.show();
  }

  return showBrowserWindowUseCase;
}

export type ShowBrowserWindowUseCase = ReturnType<typeof createShowBrowserWindowUseCase>;
