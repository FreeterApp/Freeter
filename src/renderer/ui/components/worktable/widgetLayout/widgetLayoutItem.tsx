/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetByIdComponent } from '@/ui/components/widget/widgetById';
import { resizeHandleIds } from '@/ui/components/worktable/widgetLayout/resizeHandles';
import { useWidgetLayoutItemViewModel, WidgetLayoutItemProps } from '@/ui/components/worktable/widgetLayout/widgetLayoutItemViewModel';
import clsx from 'clsx';
import styles from './widgetLayout.module.scss';
import { memo } from 'react';

type Deps = {
  WidgetById: WidgetByIdComponent;
}

export function createWidgetLayoutItemComponent({
  WidgetById
}: Deps) {
  function Component(props: WidgetLayoutItemProps) {
    const {
      env,
      widgetId,
      isEditable,
      isDragging,
      isResizing,
      isMaximized,
      rectPx,
      onDragStartHandler,
      onDragEndHandler,
      onResizeMouseDownHandler,
      maximizeAction,
    } = useWidgetLayoutItemViewModel(props);

    return (
      <div
        className={clsx(styles['layout-item'], isDragging && styles['is-dragging'], isResizing && styles['is-resizing'], isMaximized && styles['is-maximized'])}
        draggable={isEditable}
        onDragStart={onDragStartHandler}
        onDragEnd={onDragEndHandler}
        style={{
          transform: `translate(${rectPx.xPx}px,${rectPx.yPx}px)`,
          width: `${rectPx.wPx}px`,
          height: `${rectPx.hPx}px`,
        }}
        data-testid="widget-layout-item"
      >
        <WidgetById env={env} id={widgetId} maximizeAction={maximizeAction} />
        {isEditable && resizeHandleIds.map(id => (
          <div key={id}
            className={clsx(styles['resize-handle'], styles[id])}
            onMouseDown={(e) => onResizeMouseDownHandler(e, id)}
            data-testid="widget-layout-item-resize-handle"
          ></div>
        ))}
      </div>
    )
  }
  return memo(Component);
}

export type WidgetLayoutItemComponent = ReturnType<typeof createWidgetLayoutItemComponent>;
