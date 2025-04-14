/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { EntityList, findEntityIndexOnList, findEntityOnList, removeEntityFromListAtIndex, updateEntityOnList } from '@/base/entityList';

export const widgetLayoutVisibleCols = 16;
export const widgetLayoutVisibleRows = 8;


export interface WidgetLayoutItemXY {
  readonly x: number;
  readonly y: number;
}

export interface WidgetLayoutItemWH {
  readonly w: number;
  readonly h: number;
}

export interface WidgetLayoutItemRect extends WidgetLayoutItemXY, WidgetLayoutItemWH { }

export interface WidgetLayoutItem extends Entity {
  readonly widgetId: string;
  readonly rect: WidgetLayoutItemRect;
}

export type WidgetLayout = EntityList<WidgetLayoutItem>;

interface WidgetLayoutItemMutableRect extends WidgetLayoutItem {
  rect: WidgetLayoutItemRect;
  initiator: boolean;
}
type WidgetLayoutItemsMutableRect = Array<WidgetLayoutItemMutableRect>;

function _itemsCollide(item1: WidgetLayoutItem, item2: WidgetLayoutItem): boolean {
  return (
    (item1.id !== item2.id) // different items
    && (item1.rect.x + item1.rect.w > item2.rect.x) && (item2.rect.x + item2.rect.w > item1.rect.x) // and overlap on x-axis
    && (item1.rect.y + item1.rect.h > item2.rect.y) && (item2.rect.y + item2.rect.h > item1.rect.y) // and overlap on y-axis
  )
}

function _getCollisions<T extends WidgetLayoutItem[]>(items: T, item: WidgetLayoutItem): T {
  return items.filter(itemI => _itemsCollide(itemI, item)) as T;
}

function _sortItems<T extends WidgetLayoutItem[]>(items: T): T {
  // Sort modifies array, clone it first with slice (the fastest method: https://jsben.ch/lO6C5)
  return items.slice().sort((a, b) => {
    if (a.rect.y > b.rect.y || (a.rect.y === b.rect.y && a.rect.x > b.rect.x)) {
      return -1;
    } else if (a.rect.y === b.rect.y && a.rect.x === b.rect.x) {
      return 0;
    } else {
      return 1;
    }
  }) as T;
}

function _fixCollisionsIter(
  layout: WidgetLayoutItemsMutableRect,
  item: WidgetLayoutItemMutableRect
): WidgetLayoutItemsMutableRect {
  const sorted = _sortItems(layout);
  const collisions = _getCollisions(sorted, item);

  for (let i = 0, len = collisions.length; i < len; i++) {
    const collision = collisions[i];

    if (collision.initiator) {
      continue;
    }

    Object.assign(collision.rect, { y: item.rect.y + item.rect.h });
    layout = _fixCollisionsIter(layout, collision);
  }

  return layout;
}

function _fixCollisions(
  layout: WidgetLayout,
  itemId: string
): WidgetLayout {
  const layoutMutableRect = layout.map((item): WidgetLayoutItemMutableRect => ({
    ...item,
    rect: { ...item.rect },
    initiator: (item.id === itemId)
  }));

  const item = findEntityOnList(layoutMutableRect, itemId);
  if (!item) {
    return layout;
  }

  const newLayout = _fixCollisionsIter(layoutMutableRect, item)
    .map((item): WidgetLayoutItem => {
      const { initiator, ...rest } = item;
      return rest;
    })

  return newLayout;
}

function _fixRect(rect: WidgetLayoutItemRect): WidgetLayoutItemRect {
  const x = Math.max(0, rect.x);
  const y = Math.max(0, rect.y);
  const w = Math.max(0, rect.w);
  const h = Math.max(0, rect.h);
  return {
    x,
    y,
    w,
    h
  }
}

function _updateLayoutItemRect(
  layout: WidgetLayout,
  itemId: string,
  newRect: WidgetLayoutItemRect
): WidgetLayout {
  let newLayout = updateEntityOnList(layout, { id: itemId, rect: newRect });
  newLayout = _fixCollisions(newLayout, itemId);
  return newLayout;
}

export function createLayout(): WidgetLayout {
  return [];
}

interface LayoutItemProps {
  readonly id: string;
  readonly rect: WidgetLayoutItemRect;
  readonly widgetId: EntityId;
}

export function createLayoutItem(
  layout: WidgetLayout,
  props: LayoutItemProps
): [layout: WidgetLayout, layoutItem: WidgetLayoutItem | null] {
  const { id, rect, widgetId } = props;

  const sameIdItem = findEntityOnList(layout, id);
  if (sameIdItem) {
    return [layout, null];
  }

  const newItem: WidgetLayoutItem = {
    id,
    rect: _fixRect(rect),
    widgetId
  }

  let newLayout: WidgetLayout = [...layout, newItem];
  newLayout = _fixCollisions(newLayout, id);
  return [newLayout, newItem];
}

export function createLayoutItemAtFreeArea(
  layout: WidgetLayout,
  itemProps: {
    readonly id: string;
    readonly size: WidgetLayoutItemWH;
    readonly widgetId: EntityId;
  }
): [layout: WidgetLayout, layoutItem: WidgetLayoutItem | null] {
  const { size, id, widgetId } = itemProps;

  const sameIdItem = findEntityOnList(layout, id);
  if (sameIdItem) {
    return [layout, null];
  }
  if (size.w > widgetLayoutVisibleCols) {
    return [layout, null];
  }
  const sorted = _sortItems([...layout]);
  for (let y = 0; ; y++) {
    for (let x = 0; x <= widgetLayoutVisibleCols - size.w;) {
      const item: WidgetLayoutItem = { id, widgetId, rect: { x, y, ...size } };
      const collisions = _getCollisions(sorted, item);
      if (collisions.length < 1) {
        return [[...layout, item], item];
      } else {
        x = collisions[0].rect.x + collisions[0].rect.w;
      }
    }
  }
}

export function moveLayoutItem(
  layout: WidgetLayout,
  itemId: string,
  toXY: WidgetLayoutItemXY
): WidgetLayout {
  const item = findEntityOnList(layout, itemId);
  if (!item) {
    return layout;
  }

  const { rect } = item;
  const newRect = _fixRect({
    ...rect,
    ...toXY
  })

  if (rect.y === newRect.y
    && rect.x === newRect.x) {
    return layout;
  }

  return _updateLayoutItemRect(layout, itemId, newRect);
}

export function removeLayoutItem(
  layout: WidgetLayout,
  itemId: string
): WidgetLayout {
  const removeIdx = findEntityIndexOnList(layout, itemId);
  if (removeIdx < 0) {
    return layout;
  }
  return removeEntityFromListAtIndex(layout, removeIdx);
}

export function resizeLayoutItemByEdges(
  layout: WidgetLayout,
  itemId: string,
  delta: { left?: number; top?: number; right?: number; bottom?: number },
  minSize: { w: number, h: number }
): WidgetLayout {
  const item = findEntityOnList(layout, itemId);
  if (!item) {
    return layout;
  }

  const { rect } = item;
  let { x, y, w, h } = rect;

  if (delta.left) {
    const deltaLeft = Math.min(x, Math.max(minSize.w - w, delta.left));
    x -= deltaLeft;
    w += deltaLeft;
  }
  if (delta.top) {
    const deltaTop = Math.min(y, Math.max(minSize.h - h, delta.top));
    y -= deltaTop;
    h += deltaTop;
  }
  if (delta.right) {
    const deltaRight = Math.max(minSize.w - w, delta.right);
    w += deltaRight;
  }
  if (delta.bottom) {
    const deltaBottom = Math.max(minSize.h - h, delta.bottom);
    h += deltaBottom;
  }

  if (item.rect.y === y
    && item.rect.x === x
    && item.rect.w === w
    && item.rect.h === h) {
    return layout;
  }

  return _updateLayoutItemRect(layout, itemId, { x, y, w, h });
}
