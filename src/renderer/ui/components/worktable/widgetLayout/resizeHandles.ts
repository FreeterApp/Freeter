/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

/**
 * Resize handles
 */

import { WorktableStateResizingItemEdges, WorktableStateResizingItemEdgeX, WorktableStateResizingItemEdgeY } from '@/base/state/ui';

export const resizeHandleIds = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;
export type ResizeHandleId = typeof resizeHandleIds[number];

export const resizeEdgesByHandleId: Record<ResizeHandleId, WorktableStateResizingItemEdges> = {
  'n': {
    y: WorktableStateResizingItemEdgeY.Top
  }, 'ne': {
    x: WorktableStateResizingItemEdgeX.Right,
    y: WorktableStateResizingItemEdgeY.Top
  }, 'e': {
    x: WorktableStateResizingItemEdgeX.Right
  }, 'se': {
    x: WorktableStateResizingItemEdgeX.Right,
    y: WorktableStateResizingItemEdgeY.Bottom
  }, 's': {
    y: WorktableStateResizingItemEdgeY.Bottom
  }, 'sw': {
    x: WorktableStateResizingItemEdgeX.Left,
    y: WorktableStateResizingItemEdgeY.Bottom
  }, 'w': {
    x: WorktableStateResizingItemEdgeX.Left
  }, 'nw': {
    x: WorktableStateResizingItemEdgeX.Left,
    y: WorktableStateResizingItemEdgeY.Top
  }
}
