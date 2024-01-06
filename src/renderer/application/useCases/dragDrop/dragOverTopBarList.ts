/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';

type Deps = {
  appStore: AppStore;
}

export function createDragOverTopBarListUseCase({
  appStore
}: Deps) {
  const dragOverTopBarListUseCase = (targetListItemId: string | null) => {
    const state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom?.palette || draggingFrom?.topBarList || draggingFrom?.worktableLayout) {
      if (state.ui.dragDrop.over?.topBarList?.listItemId !== targetListItemId) {
        appStore.set({
          ...state,
          ui: {
            ...state.ui,
            dragDrop: {
              ...state.ui.dragDrop,
              over: {
                topBarList: {
                  listItemId: targetListItemId
                }
              }
            }
          }
        })
      }
      return true;
    } else {
      return false;
    }
  }

  return dragOverTopBarListUseCase;
}

export type DragOverTopBarListUseCase = ReturnType<typeof createDragOverTopBarListUseCase>;
