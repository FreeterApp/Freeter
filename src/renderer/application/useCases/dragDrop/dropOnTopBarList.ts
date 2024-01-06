/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { removeLayoutItem } from '@/base/widgetLayout';
import { createListItem } from '@/base/widgetList';
import { moveEntityInList } from '@/base/entityList';
import { AppStore } from '@/application/interfaces/store';
import { addWidgetToAppState, dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createDropOnTopBarListUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const dropOnTopBarListUseCase = (targetListItemId: string | null) => {
    let state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom) {
      const { widgetList } = state.ui.shelf;
      if (draggingFrom.palette) {
        [state] = addWidgetToAppState(state, {
          type: 'shelf',
          newListItemId: idGenerator(),
          targetListItemId
        }, draggingFrom.palette.widgetTypeId, idGenerator())
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
