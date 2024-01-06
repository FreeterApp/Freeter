/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { findEntityOnList } from '@/base/entityList';
import { dragDropStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createDragWidgetFromTopBarListUseCase({
  appStore,
}: Deps) {
  const dragWidgetFromTopBarListUseCase = (sourceWidgetId: string, sourceListItemId: string) => {
    let state = appStore.get();
    const { widgetList } = state.ui.shelf;
    const item = findEntityOnList(widgetList, sourceListItemId);
    if (item) {
      state = dragDropStateActions.resetOver(state);
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          dragDrop: {
            ...state.ui.dragDrop,
            from: {
              topBarList: {
                widgetId: sourceWidgetId,
                listItemId: sourceListItemId
              }
            }
          }
        }
      })
    }
  }

  return dragWidgetFromTopBarListUseCase;
}

export type DragWidgetFromTopBarListUseCase = ReturnType<typeof createDragWidgetFromTopBarListUseCase>;
