/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { AppState } from '@/base/state/app';
import { WidgetLayoutItemXY } from '@/base/widgetLayout';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}

export function createDragOverWorktableLayoutUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const updateState = (state: AppState, targetWidgetLayoutItemId: EntityId, toXY: WidgetLayoutItemXY) => {
    const curXY = state.ui.dragDrop.over?.worktableLayout?.layoutItemXY;
    if ((curXY?.x !== toXY.x) || (curXY.y !== toXY.y)) {
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          dragDrop: {
            ...state.ui.dragDrop,
            over: {
              worktableLayout: {
                layoutItemId: targetWidgetLayoutItemId,
                layoutItemXY: toXY
              }
            }
          }
        }
      })
    }
  }

  const dragOverWorktableLayoutUseCase = (toXY: WidgetLayoutItemXY) => {
    const state = appStore.get();

    const draggingFrom = state.ui.dragDrop.from;
    const overWorktableLayout = state.ui.dragDrop.over?.worktableLayout;

    if (draggingFrom) {
      if (draggingFrom.worktableLayout) {
        updateState(state, draggingFrom.worktableLayout.layoutItemId, toXY);
        return true;
      } else if (draggingFrom.topBarList || draggingFrom.palette) {
        updateState(state, overWorktableLayout?.layoutItemId ?? idGenerator(), toXY);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return dragOverWorktableLayoutUseCase;
}

export type DragOverWorktableLayoutUseCase = ReturnType<typeof createDragOverWorktableLayoutUseCase>;
