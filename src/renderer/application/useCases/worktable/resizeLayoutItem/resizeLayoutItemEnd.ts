/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { resizeLayoutItemCalc } from '@/application/useCases/worktable/resizeLayoutItem/calc';
import { entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createResizeLayoutItemEndUseCase({
  appStore,
}: Deps) {
  const resizeLayoutItemEndUseCase = (delta: { x?: number; y?: number }): void => {
    let state = appStore.get();
    const { resizingItem } = state.ui.worktable;
    if (!resizingItem) {
      return;
    }

    const workflow = entityStateActions.workflows.getOne(state, resizingItem.workflowId);
    if (workflow) {
      const newLayout = resizeLayoutItemCalc(workflow.layout, resizingItem.itemId, delta, resizingItem.minSize, resizingItem.edges);
      state = entityStateActions.workflows.updateOne(state, {
        id: workflow.id,
        changes: {
          layout: newLayout
        }
      })
    }
    state = {
      ...state,
      ui: {
        ...state.ui,
        worktable: {
          ...state.ui.worktable,
          resizingItem: undefined
        }
      }
    }
    appStore.set(state);
  }

  return resizeLayoutItemEndUseCase;
}

export type RezizeLayoutItemEndUseCase = ReturnType<typeof createResizeLayoutItemEndUseCase>;
