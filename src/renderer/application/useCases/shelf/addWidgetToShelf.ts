/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { AddItemToWidgetListSubCase } from '@/application/useCases/shelf/subs/addItemToWidgetList';
import { CreateWidgetSubCase } from '@/application/useCases/widget/subs/createWidget';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection } from '@/base/entityCollection';
import { getAllWidgetNamesFromWidgetList } from '@/base/state/actions/usedNames';
import { generateWidgetName } from '@/base/widget';

type Deps = {
  appStore: AppStore;
  createWidgetSubCase: CreateWidgetSubCase;
  addItemToWidgetListSubCase: AddItemToWidgetListSubCase;
}
export function createAddWidgetToShelfUseCase({
  appStore,
  createWidgetSubCase,
  addItemToWidgetListSubCase,
}: Deps) {
  const addWidgetToShelfUseCase = (widgetTypeId: EntityId, toPosListItemId: EntityId | null) => {
    const state = appStore.get();
    const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widgetTypeId);
    if (!widgetType) {
      return;
    }
    const { widgetList } = state.ui.shelf;

    const newWidget = createWidgetSubCase(
      widgetType,
      generateWidgetName(widgetType.name, getAllWidgetNamesFromWidgetList(state.entities.widgets, widgetList))
    )
    const newWidgetList = addItemToWidgetListSubCase(newWidget.id, widgetList, toPosListItemId)

    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        widgets: addOneToEntityCollection(state.entities.widgets, newWidget)
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

  return addWidgetToShelfUseCase;
}

export type AddWidgetToShelfUseCase = ReturnType<typeof createAddWidgetToShelfUseCase>;
