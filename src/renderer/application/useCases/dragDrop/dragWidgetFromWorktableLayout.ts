/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { findEntityOnList } from '@/base/entityList';
import { dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createDragWidgetFromWorktableLayoutUseCase({
  appStore,
}: Deps) {
  const dragWidgetFromWorktableLayoutUseCase = (sourceWorkflowId: EntityId, sourceWidgetId: EntityId, sourceWidgetLayoutItemId: EntityId) => {
    let state = appStore.get();
    const workflow = entityStateActions.workflows.getOne(state, sourceWorkflowId);

    if (workflow) {
      const item = findEntityOnList(workflow.layout, sourceWidgetLayoutItemId);
      if (item) {
        state = dragDropStateActions.resetOver(state);
        const { w, h } = item.rect;
        appStore.set({
          ...state,
          ui: {
            ...state.ui,
            dragDrop: {
              ...state.ui.dragDrop,
              from: {
                worktableLayout: {
                  workflowId: sourceWorkflowId,
                  widgetId: sourceWidgetId,
                  layoutItemId: sourceWidgetLayoutItemId,
                  layoutItemWH: { w, h }
                }
              }
            }
          }
        })
      }
    }
  }

  return dragWidgetFromWorktableLayoutUseCase;
}

export type DragWidgetFromWorktableLayoutUseCase = ReturnType<typeof createDragWidgetFromWorktableLayoutUseCase>;
