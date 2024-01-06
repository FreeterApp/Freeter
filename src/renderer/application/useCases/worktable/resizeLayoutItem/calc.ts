/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdges, WorktableStateResizingItemEdgeX, WorktableStateResizingItemEdgeY } from '@/base/state/ui';
import { findEntityOnList } from '@/base/entityList';
import { resizeLayoutItemByEdges, WidgetLayout } from '@/base/widgetLayout';

export function resizeLayoutItemCalc(
  widgetLayout: WidgetLayout,
  itemId: string,
  delta: { x?: number; y?: number },
  minSize: { w: number, h: number },
  edges: WorktableStateResizingItemEdges
): WidgetLayout {
  if (delta.x === undefined && delta.y === undefined) {
    return widgetLayout;
  }

  const item = findEntityOnList(widgetLayout, itemId);
  if (!item) {
    return widgetLayout;
  }

  const edgeDelta: { left?: number; top?: number; right?: number; bottom?: number } = {};

  if (delta.x !== undefined) {
    switch (edges.x) {
      case WorktableStateResizingItemEdgeX.Left: {
        edgeDelta.left = delta.x
        break;
      }
      case WorktableStateResizingItemEdgeX.Right: {
        edgeDelta.right = delta.x
        break;
      }
    }
  }

  if (delta.y !== undefined) {
    switch (edges.y) {
      case WorktableStateResizingItemEdgeY.Top: {
        edgeDelta.top = delta.y
        break;
      }
      case WorktableStateResizingItemEdgeY.Bottom: {
        edgeDelta.bottom = delta.y
        break;
      }
    }
  }

  return resizeLayoutItemByEdges(widgetLayout, itemId, edgeDelta, minSize);
}
