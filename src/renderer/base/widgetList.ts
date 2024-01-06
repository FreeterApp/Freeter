/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { addEntityToList, EntityList, findEntityIndexOnList, findEntityOnList } from '@/base/entityList';

export interface WidgetListItem extends Entity {
  readonly widgetId: string;
}
export type WidgetList = EntityList<WidgetListItem>;

export function createList(): WidgetList {
  return [];
}

interface ListItemProps {
  readonly id: string;
  readonly widgetId: string;
}

export function createListItem(
  list: WidgetList,
  props: ListItemProps,
  itemTargetId: string | null
): [list: WidgetList, listItem: WidgetListItem | null] {
  const { id, widgetId } = props;

  const sameIdItem = findEntityOnList(list, id);
  if (sameIdItem) {
    return [list, null];
  }

  let toIdx = itemTargetId === null ? -1 : findEntityIndexOnList(list, itemTargetId);
  if (toIdx < 0) {
    toIdx = list.length;
  }

  const newItem: WidgetListItem = {
    id,
    widgetId
  }

  const newList = addEntityToList(list, newItem, toIdx);

  return [newList, newItem];
}
