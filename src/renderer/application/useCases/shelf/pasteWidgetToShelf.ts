/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { CloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/cloneWidgetToWidgetListSubCase';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';

type Deps = {
  appStore: AppStore;
  cloneWidgetToWidgetListSubCase: CloneWidgetToWidgetListSubCase;
}
export function createPasteWidgetToShelfUseCase({
  appStore,
  cloneWidgetToWidgetListSubCase,
}: Deps) {
  const useCase = async (widgetCopyId: EntityId, atPosListItemId: EntityId | null) => {
    const state = appStore.get();
    const widgetCopyEntity = getOneFromEntityCollection(state.ui.copy.widgets.entities, widgetCopyId);
    if (!widgetCopyEntity) {
      return;
    }
    const { entity: widget } = widgetCopyEntity;

    const { widgetList } = state.ui.shelf;

    const [newWidget, newWidgetList] = await cloneWidgetToWidgetListSubCase(widget, widgetList, mapIdListToEntityList(state.entities.widgets, widgetList.map(item => item.widgetId)).map(item => item?.coreSettings.name || ''), atPosListItemId)

    appStore.set({
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
    });
  }

  return useCase;
}

export type PasteWidgetToShelfUseCase = ReturnType<typeof createPasteWidgetToShelfUseCase>;
