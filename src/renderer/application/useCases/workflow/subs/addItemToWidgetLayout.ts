/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { EntityId } from '@/base/entity';
import { WidgetLayout, WidgetLayoutItemWH, WidgetLayoutItemXY, createLayoutItem, createLayoutItemAtFreeArea } from '@/base/widgetLayout';

type Deps = {
  idGenerator: IdGenerator;
}
export function createAddItemToWidgetLayoutSubCase({
  idGenerator,
}: Deps) {
  function subCase(
    widgetId: EntityId,
    toWidgetLayout: WidgetLayout,
    layoutItemWH: WidgetLayoutItemWH,
    layoutItemXY?: WidgetLayoutItemXY
  ): WidgetLayout {
    const newId = idGenerator();
    const [newLayout] = layoutItemXY ? createLayoutItem(
      toWidgetLayout,
      {
        id: newId,
        rect: {
          ...layoutItemXY,
          ...layoutItemWH
        },
        widgetId
      }
    ) : createLayoutItemAtFreeArea(
      toWidgetLayout,
      {
        id: newId,
        size: layoutItemWH,
        widgetId
      }
    );

    return newLayout;
  }

  return subCase;
}

export type AddItemToWidgetLayoutSubCase = ReturnType<typeof createAddItemToWidgetLayoutSubCase>;
