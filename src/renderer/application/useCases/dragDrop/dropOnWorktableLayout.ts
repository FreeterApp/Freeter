/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createLayoutItem, moveLayoutItem, removeLayoutItem, WidgetLayoutItemXY } from '@/base/widgetLayout';
import { removeEntityFromList } from '@/base/entityList';
import { EntityId } from '@/base/entity';
import { AppStore } from '@/application/interfaces/store';
import { addWidgetToAppState, dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}

export function createDropOnWorktableLayoutUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const dropOnWorktableLayoutUseCase = (toWorkflowId: EntityId, toXY: WidgetLayoutItemXY) => {
    let state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom) {
      if (draggingFrom.palette) {
        [state] = addWidgetToAppState(state, {
          type: 'workflow',
          newLayoutItemId: idGenerator(),
          newLayoutItemXY: toXY,
          workflowId: toWorkflowId
        }, draggingFrom.palette.widgetTypeId, idGenerator())
      } else if (draggingFrom.worktableLayout) {
        const toWorkflow = entityStateActions.workflows.getOne(state, toWorkflowId);
        if (toWorkflow) {
          if (toWorkflow.id === draggingFrom.worktableLayout.workflowId) {
            const newLayout = moveLayoutItem(
              toWorkflow.layout,
              draggingFrom.worktableLayout.layoutItemId,
              toXY
            );
            state = entityStateActions.workflows.updateOne(state, {
              id: toWorkflowId,
              changes: {
                layout: newLayout
              }
            });
          } else {
            const fromWorkflow = entityStateActions.workflows.getOne(state, draggingFrom.worktableLayout.workflowId);
            if (fromWorkflow) {
              const newFromLayout = removeLayoutItem(
                fromWorkflow.layout,
                draggingFrom.worktableLayout.layoutItemId
              );
              const [newToLayout] = createLayoutItem(
                toWorkflow.layout,
                {
                  id: draggingFrom.worktableLayout.layoutItemId,
                  rect: { ...draggingFrom.worktableLayout.layoutItemWH, ...toXY },
                  widgetId: draggingFrom.worktableLayout.widgetId
                }
              );

              state = entityStateActions.workflows.updateMany(state, [{
                id: fromWorkflow.id,
                changes: {
                  layout: newFromLayout
                }
              }, {
                id: toWorkflow.id,
                changes: {
                  layout: newToLayout
                }
              }])
            }
          }
        }
      } else if (draggingFrom.topBarList) {
        const toWorkflow = entityStateActions.workflows.getOne(state, toWorkflowId);
        if (toWorkflow) {
          const srcWidget = entityStateActions.widgets.getOne(state, draggingFrom.topBarList.widgetId);
          if (srcWidget) {
            const widgetType = entityStateActions.widgetTypes.getOne(state, srcWidget.type);
            if (widgetType) {
              const { w, h } = widgetType.minSize;
              const [newToLayout] = createLayoutItem(
                toWorkflow.layout,
                {
                  id: idGenerator(),
                  rect: { ...toXY, w, h },
                  widgetId: draggingFrom.topBarList.widgetId
                }
              );
              state = entityStateActions.workflows.updateOne(state, {
                id: toWorkflow.id,
                changes: {
                  layout: newToLayout
                }
              });

              const { widgetList } = state.ui.shelf;
              const newWidgetList = removeEntityFromList(
                widgetList,
                draggingFrom.topBarList.listItemId
              );
              state = {
                ...state,
                ui: {
                  ...state.ui,
                  shelf: {
                    ...state.ui.shelf,
                    widgetList: newWidgetList
                  }
                }
              }
            }
          }
        }
      }
      state = dragDropStateActions.resetAll(state);
      appStore.set(state);
    }
  }

  return dropOnWorktableLayoutUseCase;
}

export type DropOnWorktableLayoutUseCase = ReturnType<typeof createDropOnWorktableLayoutUseCase>;
