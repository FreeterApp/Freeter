/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { Widget, WidgetEnvAreaShelf } from '@/base/widget';
import { WidgetType } from '@/base/widgetType';
import { useElementRect } from '@/ui/hooks';
import { useWindowSize } from '@/ui/hooks/useWindowSize';
import { CSSProperties, DragEvent, MouseEvent, useCallback, useMemo } from 'react';

export interface ShelfItemProps {
  id: EntityId;
  orderNum: number;
  scrollLeft: number;
  env: WidgetEnvAreaShelf;
  widget?: Widget;
  widgetType?: WidgetType;
  isEditMode: boolean;
  isDragging: boolean;
  isDropArea: boolean;
  onContextMenu: (evt: MouseEvent<HTMLElement>, itemId: EntityId) => void;
  onDragStart: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragEnd: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragEnter: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragLeave: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDragOver: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
  onDrop: (evt: DragEvent<HTMLElement>, itemId: EntityId) => void;
}

export function useShelfItemViewModel(shelfItemEl: HTMLLIElement | null, props: ShelfItemProps) {
  const {
    env, widget, widgetType, id, isEditMode, isDragging, isDropArea,
    onDragStart, onDragEnd, onDragEnter, onDragLeave, onDragOver,
    onDrop, onContextMenu, orderNum, scrollLeft,
  } = props;

  const widgetName = widget?.coreSettings.name || widgetType?.name || '';
  const onDragStartHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragStart(evt, id);
  }, [id, onDragStart])

  const onDragEndHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    onDragEnd(evt, id);
  }, [id, onDragEnd])

  const onDragEnterHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragEnter(evt, id);
  }, [id, onDragEnter])

  const onDragLeaveHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragLeave(evt, id);
  }, [id, onDragLeave])

  const onDragOverHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDragOver(evt, id);
  }, [id, onDragOver])

  const onDropHandler = useCallback((evt: DragEvent<HTMLElement>) => {
    evt.stopPropagation();
    onDrop(evt, id);
  }, [id, onDrop])

  const onContextMenuHandler = useCallback((evt: MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    onContextMenu(evt, id);
  }, [id, onContextMenu])


  const itemElRectRefreshDep = useMemo(() => ({ orderNum, scrollLeft, isEditMode }), [
    orderNum, scrollLeft, isEditMode
  ]);
  const itemElRect = useElementRect(shelfItemEl, { useViewportRect: true, refreshDep: itemElRectRefreshDep });

  const windowSize = useWindowSize();
  const itemWidgetElRectStyle = useMemo(() => {
    const hPx = 300;
    const wPx = 300;

    let xPx = itemElRect.xPx;
    if (xPx + wPx > windowSize.wPx) {
      xPx = windowSize.wPx - wPx;
    }

    return {
      left: xPx + 'px',
      width: wPx + 'px',
      height: hPx + 'px'
    } as CSSProperties;
  }, [itemElRect.xPx, windowSize.wPx])

  return {
    env,
    widget,
    widgetName,
    isEditMode,
    isDragging,
    isDropArea,
    itemWidgetElRectStyle,
    onContextMenuHandler,
    onDragStartHandler,
    onDragEndHandler,
    onDragEnterHandler,
    onDragLeaveHandler,
    onDragOverHandler,
    onDropHandler,
  }
}
