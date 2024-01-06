/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
}

export function createDragOverWorkflowSwitcherUseCase({
  appStore
}: Deps) {
  const useCase = (targetWorkflowId: EntityId | null) => {
    const state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom?.workflowSwitcher) {
      if (state.ui.dragDrop.over?.workflowSwitcher?.workflowId !== targetWorkflowId) {
        appStore.set({
          ...state,
          ui: {
            ...state.ui,
            dragDrop: {
              ...state.ui.dragDrop,
              over: {
                workflowSwitcher: {
                  workflowId: targetWorkflowId
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

  return useCase;
}

export type DragOverWorkflowSwitcherUseCase = ReturnType<typeof createDragOverWorkflowSwitcherUseCase>;
