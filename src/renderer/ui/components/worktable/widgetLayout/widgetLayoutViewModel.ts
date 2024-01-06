/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { DragOverWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dragOverWorktableLayout';
import { DragWidgetFromWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dragWidgetFromWorktableLayout';
import { DropOnWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dropOnWorktableLayout';
import { RezizeLayoutItemUseCase } from '@/application/useCases/worktable/resizeLayoutItem/resizeLayoutItem';
import { RezizeLayoutItemStartUseCase } from '@/application/useCases/worktable/resizeLayoutItem';
import { createLayoutItem, moveLayoutItem, WidgetLayout, WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';
import { calcGridColWidth, calcGridRowHeight, itemXPxToUnits, itemYPxToUnits } from '@/ui/components/worktable/widgetLayout/calcs';
import { useComponentMounted, useElementRect } from '@/ui/hooks';
import { XYPx } from '@/ui/types/dimensions';
import { DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { findEntityOnList } from '@/base/entityList';
import { resizeLayoutItemCalc } from '@/application/useCases/worktable/resizeLayoutItem/calc';
import { EntityId } from '@/base/entity';
import { DragDropFromState, DragDropOverWorktableLayoutState, WorktableResizingItemState, WorktableStateResizingItemEdges } from '@/base/state/ui';
import { createWidgetEnv, WidgetEnvAreaWorkflow } from '@/base/widget';
import { WidgetType } from '@/base/widgetType';

interface DraggedLayoutItem {
  fromPointPx: XYPx;
  size: WidgetLayoutItemWH;
}

export interface WidgetLayoutProps {
  projectId: EntityId;
  workflowId: EntityId;
  isVisible: boolean;
  layoutItems: WidgetLayout;
  isEditMode: boolean;
  resizingItem: WorktableResizingItemState | undefined;
  dndDraggingWidgetType: WidgetType | undefined;
  dndDraggingFrom: DragDropFromState | undefined;
  dndOverWorktableLayout: DragDropOverWorktableLayoutState | undefined;
}

type Deps = {
  dragWidgetFromWorktableLayoutUseCase: DragWidgetFromWorktableLayoutUseCase;
  dragOverWorktableLayoutUseCase: DragOverWorktableLayoutUseCase;
  dropOnWorktableLayoutUseCase: DropOnWorktableLayoutUseCase;
  dragLeaveTargetUseCase: DragLeaveTargetUseCase;
  dragEndUseCase: DragEndUseCase;
  resizeLayoutItemUseCase: RezizeLayoutItemUseCase;
  resizeLayoutItemStartUseCase: RezizeLayoutItemStartUseCase;
  resizeLayoutItemEndUseCase: RezizeLayoutItemUseCase;
}

export function createWidgetLayoutViewModelHook({
  dragWidgetFromWorktableLayoutUseCase,
  dragOverWorktableLayoutUseCase,
  dropOnWorktableLayoutUseCase,
  dragLeaveTargetUseCase,
  dragEndUseCase,
  resizeLayoutItemUseCase,
  resizeLayoutItemStartUseCase,
  resizeLayoutItemEndUseCase,
}: Deps) {
  function useWidgetLayoutViewModel(layoutEl: React.RefObject<HTMLDivElement>, props: WidgetLayoutProps) {
    const {
      isVisible,
      isEditMode,
      layoutItems,
      projectId,
      workflowId,
      dndDraggingWidgetType,
      dndDraggingFrom,
      dndOverWorktableLayout,
      resizingItem,
    } = props;
    const viewportSize = useElementRect(layoutEl);
    const componentMounted = useComponentMounted();

    const [draggedLayoutItem, setDraggedLayoutItem] = useState<DraggedLayoutItem | null>(null);

    // can drop here if dragged from a supported dnd source
    const dndIsDropArea = dndDraggingFrom?.palette || dndDraggingFrom?.topBarList || dndDraggingFrom?.worktableLayout;

    const viewLayoutItems = useMemo(() => {
      let viewLayoutItems = layoutItems;
      if (isVisible && isEditMode && layoutItems) {
        if (dndDraggingWidgetType && dndDraggingFrom && dndOverWorktableLayout) {
          if (dndDraggingFrom.worktableLayout?.workflowId === workflowId) {
            viewLayoutItems = moveLayoutItem(
              layoutItems,
              dndOverWorktableLayout.layoutItemId,
              dndOverWorktableLayout.layoutItemXY
            );
          } else if (dndDraggingFrom.topBarList || dndDraggingFrom.palette) {
            const { w, h } = dndDraggingWidgetType.minSize;
            viewLayoutItems = createLayoutItem(
              layoutItems,
              {
                id: dndOverWorktableLayout.layoutItemId,
                rect: { ...dndOverWorktableLayout.layoutItemXY, w, h },
                widgetId: ''
              }
            )[0];
          }
        } else if (resizingItem) {
          viewLayoutItems = resizeLayoutItemCalc(layoutItems, resizingItem.itemId, resizingItem.delta, resizingItem.minSize, resizingItem.edges);
        }
      }
      return viewLayoutItems;
    }, [layoutItems, isVisible, isEditMode, dndDraggingWidgetType, dndDraggingFrom, dndOverWorktableLayout, resizingItem, workflowId]);

    const env = useMemo(() => {
      const env: WidgetEnvAreaWorkflow | undefined = createWidgetEnv({
        area: 'workflow',
        projectId,
        workflowId
      });
      return env
    }, [projectId, workflowId])

    const dndTargetWidgetLayoutItem = useMemo(() => isVisible && isEditMode && viewLayoutItems && dndOverWorktableLayout
      ? viewLayoutItems.find(itemState => itemState.id === dndOverWorktableLayout.layoutItemId)
      : undefined, [isVisible, isEditMode, dndOverWorktableLayout, viewLayoutItems]);

    const resizingWidgetLayoutItem = useMemo(() => isVisible && isEditMode && viewLayoutItems && resizingItem
      ? viewLayoutItems.find(itemState => itemState.id === resizingItem.itemId)
      : undefined, [isVisible, isEditMode, resizingItem, viewLayoutItems]);

    const ghostItemRect = dndTargetWidgetLayoutItem?.rect || resizingWidgetLayoutItem?.rect;

    const dndDraggingLayoutItemId = dndDraggingFrom?.worktableLayout?.layoutItemId || dndTargetWidgetLayoutItem?.id;

    useEffect(() => {
      if (!dndDraggingFrom?.worktableLayout) {
        setDraggedLayoutItem(null);
      }
    }, [dndDraggingFrom?.worktableLayout])

    const onItemDragStart = useCallback((evt: DragEvent<HTMLElement>, itemId: string) => {
      if (!isVisible || !isEditMode || !layoutItems) {
        return;
      }

      const item = findEntityOnList(layoutItems, itemId);
      if (!item) {
        return;
      }

      const thisRect = evt.currentTarget.getBoundingClientRect();
      const draggedAt: XYPx = {
        xPx: evt.pageX - thisRect.x,
        yPx: evt.pageY - thisRect.y
      }
      const { w, h } = item.rect;

      evt.dataTransfer.setDragImage(evt.currentTarget, draggedAt.xPx, draggedAt.yPx);
      setDraggedLayoutItem({
        fromPointPx: draggedAt,
        size: { w, h }
      })

      // Timeout to update the element after setDragImage executes
      setTimeout(() => {
        dragWidgetFromWorktableLayoutUseCase(workflowId, item.widgetId, item.id);
      }, 0);
    }, [isVisible, isEditMode, workflowId, layoutItems])

    const onItemDragEnd = useCallback((_evt: DragEvent<HTMLElement>) => {
      setDraggedLayoutItem(null);
      dragEndUseCase();
    }, [])

    const onDragEnter = useCallback((_evt: DragEvent<HTMLDivElement>) => {
      // do nothing
    }, [])

    const onDragLeave = useCallback((_evt: DragEvent<HTMLDivElement>) => {
      dragLeaveTargetUseCase();
    }, [])

    const calcDropTargetXY = useCallback((evt: DragEvent<HTMLElement>): WidgetLayoutItemXY => {
      const thisRect = evt.currentTarget.getBoundingClientRect();

      const colWidth = calcGridColWidth(viewportSize);
      const rowHeight = calcGridRowHeight(viewportSize);

      const draggedToPx: XYPx = {
        xPx: evt.pageX - (thisRect.x - evt.currentTarget.scrollLeft) - (draggedLayoutItem?.fromPointPx.xPx ?? Math.round(colWidth / 2)),
        yPx: evt.pageY - (thisRect.y - evt.currentTarget.scrollTop) - (draggedLayoutItem?.fromPointPx.yPx ?? Math.round(rowHeight / 2))
      }

      return {
        x: itemXPxToUnits(draggedToPx.xPx, colWidth),
        y: itemYPxToUnits(draggedToPx.yPx, rowHeight)
      }
    }, [viewportSize, draggedLayoutItem?.fromPointPx])

    const onDragOver = useCallback((evt: DragEvent<HTMLElement>) => {
      const draggedToUnits = calcDropTargetXY(evt);

      const canDrop = dragOverWorktableLayoutUseCase(draggedToUnits);

      if (canDrop) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
      }
    }, [calcDropTargetXY])

    const onDrop = useCallback((evt: DragEvent<HTMLDivElement>) => {
      const dropOnUnits = calcDropTargetXY(evt);

      dropOnWorktableLayoutUseCase(workflowId, dropOnUnits)
    }, [workflowId, calcDropTargetXY])

    const onItemResizeStart = useCallback((itemId: string, edges: WorktableStateResizingItemEdges) => {
      resizeLayoutItemStartUseCase(workflowId, itemId, edges)
    }, [workflowId])

    const onItemResize = useCallback((delta: {
      x?: number | undefined;
      y?: number | undefined;
    }) => {
      resizeLayoutItemUseCase(delta);
    }, [])

    const onItemResizeEnd = useCallback((delta: {
      x?: number | undefined;
      y?: number | undefined;
    }) => {
      resizeLayoutItemEndUseCase(delta);
    }, [])

    const showNoWidgetsNote = viewLayoutItems.length === 0;

    return {
      env,
      componentMounted,
      isVisible,
      isEditMode,
      viewportSize,
      viewLayoutItems,
      resizingItem,
      dndIsDropArea,
      dndDraggingLayoutItemId,
      resizingWidgetLayoutItem,
      ghostItemRect,
      showNoWidgetsNote,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onItemDragStart,
      onItemDragEnd,
      onItemResizeStart,
      onItemResize,
      onItemResizeEnd,
    }
  }
  return useWidgetLayoutViewModel;
}

export type WidgetLayoutViewModel = ReturnType<typeof createWidgetLayoutViewModelHook>;
