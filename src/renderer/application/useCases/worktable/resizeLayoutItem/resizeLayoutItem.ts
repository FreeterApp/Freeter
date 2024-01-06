/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';

type Deps = {
  appStore: AppStore;
}

export function createResizeLayoutItemUseCase({
  appStore,
}: Deps) {
  function resizeLayoutItemUseCase(delta: { x?: number; y?: number }): void {
    const state = appStore.get()
    const { resizingItem } = state.ui.worktable;
    if (!resizingItem) {
      return;
    }

    if (resizingItem.delta.x !== delta.x || resizingItem.delta.y !== delta.y) {
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          worktable: {
            ...state.ui.worktable,
            resizingItem: {
              ...resizingItem,
              delta
            }
          }
        }
      })
    }
  }

  return resizeLayoutItemUseCase;
}

export type RezizeLayoutItemUseCase = ReturnType<typeof createResizeLayoutItemUseCase>;
