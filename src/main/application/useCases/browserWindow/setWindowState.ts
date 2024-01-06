/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WindowStore } from '@/application/interfaces/store';
import { WindowState } from '@/base/state/window';

interface Deps {
  windowStore: WindowStore;
}

export function createSetWindowStateUseCase(deps: Deps) {
  const { windowStore } = deps;
  return function setWindowStateUseCase(newWindowState: WindowState) {
    windowStore.set(newWindowState);
  }
}

export type SetWindowStateUseCase = ReturnType<typeof createSetWindowStateUseCase>;
