/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { EntityId } from '@/base/entity';
import { WidgetList, createListItem } from '@/base/widgetList';

type Deps = {
  idGenerator: IdGenerator;
}
export function createAddWidgetToWidgetListSubCase({
  idGenerator,
}: Deps) {
  function subCase(
    widgetId: EntityId,
    toWidgetList: WidgetList,
    toPosListItemId: EntityId | null
  ): WidgetList {
    const newId = idGenerator();
    const [newList] = createListItem(
      toWidgetList,
      {
        id: newId,
        widgetId
      },
      toPosListItemId
    );

    return newList;
  }

  return subCase;
}

export type AddWidgetToWidgetListSubCase = ReturnType<typeof createAddWidgetToWidgetListSubCase>;
