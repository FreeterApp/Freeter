/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { removeLayoutItem } from '@/base/widgetLayout';
import { createListItem } from '@/base/widgetList';
import { mapIdListToEntityList, moveEntityInList } from '@/base/entityList';
import { AppStore } from '@/application/interfaces/store';
import { addWidgetToAppState, dragDropStateActions, entityStateActions } from '@/base/state/actions';
import { CloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/subs/cloneWidgetToWidgetList';
import { addOneToEntityCollection, getOneFromEntityCollection } from '@/base/entityCollection';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
  cloneWidgetToWidgetListSubCase: CloneWidgetToWidgetListSubCase;
}
export function createDropOnTopBarListUseCase({
  appStore,
  idGenerator,
  cloneWidgetToWidgetListSubCase,
}: Deps) {
  const dropOnTopBarListUseCase = async (targetListItemId: string | null) => {
    let state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom) {
      const { widgetList } = state.ui.shelf;
      if (draggingFrom.palette) {
        if (draggingFrom.palette.widgetTypeId) {
          [state] = addWidgetToAppState(state, {
            type: 'shelf',
            newListItemId: idGenerator(),
            targetListItemId
          }, draggingFrom.palette.widgetTypeId, idGenerator())
        } else if (draggingFrom.palette.widgetCopyId) {
          const widgetCopyEntity = getOneFromEntityCollection(state.ui.copy.widgets.entities, draggingFrom.palette.widgetCopyId);
          if (widgetCopyEntity) {
            const { entity: widget } = widgetCopyEntity;

            const { widgetList } = state.ui.shelf;

            const [newWidget, newWidgetList] = await cloneWidgetToWidgetListSubCase(widget, widgetList, mapIdListToEntityList(state.entities.widgets, widgetList.map(item => item.widgetId)).map(item => item?.coreSettings.name || ''), targetListItemId)

            state = {
              ...state,
              entities: {
                ...state.entities,
                widgets: addOneToEntityCollection(state.entities.widgets, newWidget),
              },
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
      } else if (draggingFrom.topBarList) {
        const newWidgetList = moveEntityInList(
          widgetList,
          draggingFrom.topBarList.listItemId,
          targetListItemId
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
      } else if (draggingFrom.worktableLayout) {
        const [newWidgetList] = createListItem(
          widgetList,
          {
            id: idGenerator(),
            widgetId: draggingFrom.worktableLayout.widgetId
          },
          targetListItemId
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

        const workflow = entityStateActions.workflows.getOne(state, draggingFrom.worktableLayout.workflowId);
        if (workflow) {
          const newLayout = removeLayoutItem(
            workflow.layout,
            draggingFrom.worktableLayout.layoutItemId
          );
          state = entityStateActions.workflows.updateOne(state, {
            id: workflow.id,
            changes: {
              layout: newLayout
            }
          })
        }
      }
      state = dragDropStateActions.resetAll(state);
      appStore.set(state);
    }
  }

  return dropOnTopBarListUseCase;
}

export type DropOnTopBarListUseCase = ReturnType<typeof createDropOnTopBarListUseCase>;
