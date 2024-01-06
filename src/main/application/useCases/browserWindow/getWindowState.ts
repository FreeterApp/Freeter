/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WindowStore } from '@/application/interfaces/store';

interface Deps {
  windowStore: WindowStore;
}

export function createGetWindowStateUseCase(deps: Deps) {
  const { windowStore } = deps;
  return function getWindowStateUseCase() {
    return windowStore.get();
  }
}

export type GetWindowStateUseCase = ReturnType<typeof createGetWindowStateUseCase>;
