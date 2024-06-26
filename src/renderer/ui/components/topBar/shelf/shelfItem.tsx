/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShelfItemProps, useShelfItemViewModel } from '@/ui/components/topBar/shelf/shelfItemViewModel';
import { WidgetComponent } from '@/ui/components/widget';
import clsx from 'clsx';
import * as styles from './shelf.module.scss';
import { useRef } from 'react';

type Deps = {
  Widget: WidgetComponent;
}

export function createShelfItemComponent({
  Widget
}: Deps) {
  function Component(props: ShelfItemProps) {
    const shelfItemEl = useRef<HTMLLIElement>(null);
    const {
      widget,
      widgetName,
      env,
      isEditMode,
      // isDragging,
      isDropArea,
      itemWidgetElRectStyle,
      onContextMenuHandler,
      onDragStartHandler,
      onDragEndHandler,
      onDragEnterHandler,
      onDragLeaveHandler,
      onDragOverHandler,
      onDropHandler,
    } = useShelfItemViewModel(shelfItemEl, props);

    return (
      <li
        className={clsx(
          styles['shelf-item'],
          // isDragging && styles['is-dragging'],
          isDropArea && styles['is-drop-area'],
        )}
        onContextMenu={onContextMenuHandler}
        tabIndex={0}
        ref={shelfItemEl}
      >
        <div
          className={styles['shelf-item-caption']}
          draggable={isEditMode}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
          onDragEnter={onDragEnterHandler}
          onDragLeave={onDragLeaveHandler}
          onDragOver={onDragOverHandler}
          onDrop={onDropHandler}
        >
          {widgetName}
        </div>
        <div
          className={styles['shelf-item-widget-box']}
          style={itemWidgetElRectStyle}
        >
          <div className={styles['shelf-item-widget']}>
            {widget && <Widget widget={widget} env={env} />}
          </div>
        </div>
      </li>
    )
  }
  return Component;
}

export type ShelfItemComponent = ReturnType<typeof createShelfItemComponent>;
