/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdges, WorktableStateResizingItemEdgeX, WorktableStateResizingItemEdgeY } from '@/base/state/ui';
import { WidgetLayoutItemRect } from '@/base/widgetLayout';
import { itemRectUnitsToPx, itemWUnitsToPx, itemHUnitsToPx, calcGridColWidth, calcGridRowHeight, itemXPxToUnits, itemYPxToUnits, clamp } from '@/ui/components/worktable/widgetLayout/calcs';
import { resizeEdgesByHandleId, ResizeHandleId } from '@/ui/components/worktable/widgetLayout/resizeHandles';
import { RectPx, WHPx, XYPx } from '@/ui/types/dimensions';
import { DragEvent, MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react';
import { WidgetEnvAreaWorkflow } from '@/base/widget';

export interface WidgetLayoutItemProps {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  resizingMinSize?: {
    w: number;
    h: number;
  }
  env: WidgetEnvAreaWorkflow;
  widgetId: string;
  isEditable: boolean;
  isDragging: boolean;
  viewportSize: WHPx;
  onDragStart: (evt: DragEvent<HTMLElement>, itemId: string) => void;
  onDragEnd: (evt: DragEvent<HTMLElement>) => void;
  onResizeStart: (itemId: string, edges: WorktableStateResizingItemEdges) => void;
  onResize: (delta: {
    x?: number | undefined;
    y?: number | undefined;
  }) => void;
  onResizeEnd: (delta: {
    x?: number | undefined;
    y?: number | undefined;
  }) => void;
}

export interface ResizingState {
  draggingEdges: WorktableStateResizingItemEdges;
  initialItemRectUnits: WidgetLayoutItemRect;
  rectPx: RectPx;
  fromPointPx: XYPx
}

function calcDeltasForMouseEvent(evt: MouseEvent, fromPointPx: XYPx, colWidth: number, rowHeight: number, xMulti: number, yMulti: number) {
  const deltaPx = {
    x: evt.pageX - fromPointPx.xPx,
    y: evt.pageY - fromPointPx.yPx
  }
  const deltaUnits = {
    x: itemXPxToUnits(deltaPx.x, colWidth) * xMulti,
    y: itemYPxToUnits(deltaPx.y, rowHeight) * yMulti
  }
  return {
    deltaPx,
    deltaUnits
  }
}

export function useWidgetLayoutItemViewModel(props: WidgetLayoutItemProps) {
  const {
    id, x, y, w, h, viewportSize, env, widgetId, resizingMinSize, isEditable, isDragging, onDragStart, onDragEnd, onResize, onResizeEnd, onResizeStart
  } = props;

  const [resizing, setResizing] = useState<ResizingState | null>(null);
  const isResizing = !!resizing;

  const colWidth = calcGridColWidth(viewportSize);
  const rowHeight = calcGridRowHeight(viewportSize);

  const rectPx: RectPx = resizing ? resizing.rectPx : itemRectUnitsToPx({ x, y, w, h }, colWidth, rowHeight);

  const onDragStartHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragStart(evt, id);
  }, [id, onDragStart]);

  const onDragEndHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragEnd(evt);
  }, [onDragEnd]);

  const onResizeMouseMoveHandler = useCallback((evt: MouseEvent) => {
    if (!isResizing) {
      return;
    }

    const minWPx = itemWUnitsToPx(resizingMinSize?.w || 1, colWidth);
    const minHPx = itemHUnitsToPx(resizingMinSize?.h || 1, rowHeight);
    const initialItemRectPx = itemRectUnitsToPx(resizing.initialItemRectUnits, colWidth, rowHeight);

    const { deltaPx, deltaUnits } = calcDeltasForMouseEvent(
      evt,
      resizing.fromPointPx,
      colWidth,
      rowHeight,
      resizing.draggingEdges.x === WorktableStateResizingItemEdgeX.Left ? -1 : 1,
      resizing.draggingEdges.y === WorktableStateResizingItemEdgeY.Top ? -1 : 1
    );

    const newRectPx = {
      ...resizing.rectPx
    }

    if (resizing.draggingEdges.x) {
      if (resizing.draggingEdges.x === WorktableStateResizingItemEdgeX.Left) {
        const initialItemRightPx = initialItemRectPx.xPx + initialItemRectPx.wPx;
        newRectPx.wPx = clamp(initialItemRectPx.wPx - deltaPx.x, minWPx, initialItemRightPx);
        newRectPx.xPx = clamp(initialItemRectPx.xPx + deltaPx.x, 0, initialItemRightPx - minWPx);
      } else {
        newRectPx.wPx = clamp(
          initialItemRectPx.wPx + deltaPx.x,
          minWPx,
          viewportSize.wPx - initialItemRectPx.xPx
        );
      }
    }
    if (resizing.draggingEdges.y) {
      if (resizing.draggingEdges.y === WorktableStateResizingItemEdgeY.Top) {
        const initialItemRightPx = initialItemRectPx.yPx + initialItemRectPx.hPx;
        newRectPx.hPx = clamp(initialItemRectPx.hPx - deltaPx.y, minHPx, initialItemRightPx);
        newRectPx.yPx = clamp(initialItemRectPx.yPx + deltaPx.y, 0, initialItemRightPx - minHPx);
      } else {
        newRectPx.hPx = Math.max(initialItemRectPx.hPx + deltaPx.y, minHPx);
      }
    }

    onResize(deltaUnits);
    setResizing(prev => (prev ? {
      ...prev,
      rectPx: newRectPx
    } : null));
  }, [
    isResizing, colWidth, rowHeight, resizing?.initialItemRectUnits,
    resizing?.fromPointPx, resizing?.draggingEdges.x, resizing?.draggingEdges.y,
    resizing?.rectPx, onResize, viewportSize.wPx, resizingMinSize
  ])

  const onResizeMouseUpHandler = useCallback((evt: MouseEvent) => {
    if (!isResizing) {
      return;
    }

    const { deltaUnits } = calcDeltasForMouseEvent(
      evt,
      resizing.fromPointPx,
      colWidth,
      rowHeight,
      resizing.draggingEdges.x === WorktableStateResizingItemEdgeX.Left ? -1 : 1,
      resizing.draggingEdges.y === WorktableStateResizingItemEdgeY.Top ? -1 : 1
    );

    onResizeEnd(deltaUnits);
    setResizing(null);
  }, [isResizing, resizing?.fromPointPx, resizing?.draggingEdges, colWidth, rowHeight, onResizeEnd])

  const onResizeMouseDownHandler = useCallback((evt: ReactMouseEvent<HTMLDivElement>, handleId: ResizeHandleId) => {
    evt.preventDefault();
    evt.stopPropagation();

    onResizeStart(id, resizeEdgesByHandleId[handleId]);
    setResizing({
      initialItemRectUnits: { x, y, w, h },
      draggingEdges: resizeEdgesByHandleId[handleId],
      fromPointPx: {
        xPx: evt.pageX,
        yPx: evt.pageY
      },
      rectPx
    })
  }, [rectPx, x, y, w, h, id, onResizeStart])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', onResizeMouseMoveHandler);
    }
    return () => {
      window.removeEventListener('mousemove', onResizeMouseMoveHandler);
    }
  }, [isResizing, onResizeMouseMoveHandler])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mouseup', onResizeMouseUpHandler);
    }
    return () => {
      window.removeEventListener('mouseup', onResizeMouseUpHandler);
    }
  }, [isResizing, onResizeMouseUpHandler])


  return {
    env,
    widgetId,
    isEditable,
    isDragging,
    isResizing,
    rectPx,
    onDragStartHandler,
    onDragEndHandler,
    onResizeMouseDownHandler,
  }
}
