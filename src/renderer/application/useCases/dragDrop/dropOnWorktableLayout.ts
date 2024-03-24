/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createLayoutItem, moveLayoutItem, removeLayoutItem, WidgetLayoutItemXY } from '@/base/widgetLayout';
import { mapIdListToEntityList, removeEntityFromList } from '@/base/entityList';
import { EntityId } from '@/base/entity';
import { AppStore } from '@/application/interfaces/store';
import { addWidgetToAppState, dragDropStateActions, entityStateActions } from '@/base/state/actions';
import { addOneToEntityCollection, getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { CloneWidgetToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/cloneWidgetToWidgetLayout';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
  cloneWidgetToWidgetLayoutSubCase: CloneWidgetToWidgetLayoutSubCase;
}

export function createDropOnWorktableLayoutUseCase({
  appStore,
  idGenerator,
  cloneWidgetToWidgetLayoutSubCase,
}: Deps) {
  const dropOnWorktableLayoutUseCase = async (toWorkflowId: EntityId, toXY: WidgetLayoutItemXY) => {
    let state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom) {
      if (draggingFrom.palette) {
        if (draggingFrom.palette.widgetTypeId) {
          [state] = addWidgetToAppState(state, {
            type: 'workflow',
            newLayoutItemId: idGenerator(),
            newLayoutItemXY: toXY,
            workflowId: toWorkflowId
          }, draggingFrom.palette.widgetTypeId, idGenerator())
        } else if (draggingFrom.palette.widgetCopyId) {
          const widgetCopyEntity = getOneFromEntityCollection(state.ui.copy.widgets.entities, draggingFrom.palette.widgetCopyId);
          if (widgetCopyEntity) {
            const { entity: widget } = widgetCopyEntity;

            const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widget.type);
            if (widgetType) {
              const toWorkflow = getOneFromEntityCollection(state.entities.workflows, toWorkflowId);

              if (toWorkflow) {
                const [newWidget, newLayout] = await cloneWidgetToWidgetLayoutSubCase(widget, toWorkflow.layout, mapIdListToEntityList(state.entities.widgets, toWorkflow.layout.map(item => item.widgetId)).map(item => item?.coreSettings.name || ''), { w: widgetType.minSize.w, h: widgetType.minSize.h }, toXY);
                state = {
                  ...state,
                  entities: {
                    ...state.entities,
                    widgets: addOneToEntityCollection(state.entities.widgets, newWidget),
                    workflows: updateOneInEntityCollection(state.entities.workflows, {
                      id: toWorkflowId,
                      changes: {
                        layout: newLayout
                      }
                    }),
                  }
                }
              }
            }
          }
        }
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
