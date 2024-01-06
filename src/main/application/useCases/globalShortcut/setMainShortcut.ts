/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';

interface Deps {
  globalShortcutProvider: GlobalShortcutProvider;
}

export function createSetMainShortcutUseCase(deps: Deps) {
  const { globalShortcutProvider } = deps;
  return async function setMainShortcutUseCase(accelerator: string, windowTarget: BrowserWindow) {
    return globalShortcutProvider.setMainShortcut(accelerator, windowTarget);
  }
}

export type SetMainShortcutUseCase = ReturnType<typeof createSetMainShortcutUseCase>;
