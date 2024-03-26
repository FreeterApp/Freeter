/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, removeManyFromEntityCollection } from '@/base/entityCollection';
import { addOrMoveItemInList, limitListLength } from '@/base/list';

type Deps = {
  appStore: AppStore;
}
export function createCopyWidgetUseCase({
  appStore,
}: Deps) {
  const useCase = (widgetId: EntityId) => {
    let state = appStore.get();
    const { widgets } = state.entities;
    const widget = widgets[widgetId];
    if (!widget) {
      return;
    }
    const [list, deletedIds] = limitListLength(addOrMoveItemInList(state.ui.copy.widgets.list, widget.id), 10);
    if (deletedIds.length > 0) {
      state = {
        ...state,
        ui: {
          ...state.ui,
          copy: {
            ...state.ui.copy,
            widgets: {
              ...state.ui.copy.widgets,
              entities: removeManyFromEntityCollection(state.ui.copy.widgets.entities, deletedIds)
            }
          }
        }
      }
    }

    state = {
      ...state,
      ui: {
        ...state.ui,
        copy: {
          ...state.ui.copy,
          widgets: {
            entities: addOneToEntityCollection(state.ui.copy.widgets.entities, {
              id: widget.id,
              deps: {},
              entity: widget
            }),
            list
          }
        }
      }
    }
    appStore.set(state);
  }

  return useCase;
}

export type CopyWidgetUseCase = ReturnType<typeof createCopyWidgetUseCase>;
