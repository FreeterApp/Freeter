/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { CloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { EntitiesState } from '@/base/state/entities';
import { WidgetLayoutItem } from '@/base/widgetLayout';

type Deps = {
  idGenerator: IdGenerator;
  cloneWidgetSubCase: CloneWidgetSubCase;
}
export function createCloneWidgetLayoutItemSubCase({
  idGenerator,
  cloneWidgetSubCase,
}: Deps) {
  async function subCase(
    item: WidgetLayoutItem,
    entitiesState: EntitiesState
  ): Promise<[newWidgetLayoutItem: WidgetLayoutItem | null, newEntitiesState: EntitiesState]> {
    const [wgtId, newEntities] = await cloneWidgetSubCase(item.widgetId, entitiesState);
    if (wgtId === null) {
      return [null, entitiesState];
    }

    const newItem: WidgetLayoutItem = {
      ...item,
      id: idGenerator(),
      widgetId: wgtId
    }
    return [newItem, newEntities];
  }

  return subCase;
}

export type CloneWidgetLayoutItemSubCase = ReturnType<typeof createCloneWidgetLayoutItemSubCase>;
