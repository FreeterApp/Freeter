/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShelfItemComponent } from '@/ui/components/topBar/shelf/shelfItem';
import { ShelfViewModelHook } from '@/ui/components/topBar/shelf/shelfViewModel';
import clsx from 'clsx';
import styles from './shelf.module.scss';
import { memo } from 'react';

type Deps = {
  ShelfItem: ShelfItemComponent;
  useShelfViewModel: ShelfViewModelHook;
}

export function createShelfComponent({
  ShelfItem,
  useShelfViewModel
}: Deps) {
  function Shelf() {
    const {
      env,
      isEditMode,
      widgetsById,
      widgetTypesById,
      widgetList,
      dndSourceListItemId,
      dndTargetListItemId,
      scrollLeft,
      dontShowWidgets,
      onItemDragStart,
      onItemDragEnd,
      onItemDragEnter,
      onItemDragLeave,
      onItemDragOver,
      onItemDrop,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onScroll,
      onContextMenu,
      onItemContextMenu,
    } = useShelfViewModel();

    return (
      <ul
        className={clsx(
          styles.shelf,
          isEditMode && dndTargetListItemId === null && styles['is-drop-area'],
          dontShowWidgets && styles['dont-show-widgets']
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onScroll={onScroll}
        onContextMenu={onContextMenu}
      >
      {widgetList.map((item, orderNum) => {
        const widget = widgetsById[item.widgetId];
        const widgetType = widget ? widgetTypesById[widget.type] : undefined;
        return <ShelfItem
          key={item.id}
          env={env}
          id={item.id}
          orderNum={orderNum}
          scrollLeft={scrollLeft}
          widget={widget}
          widgetType={widgetType}
          isEditMode={isEditMode}
          isDragging={item.id===dndSourceListItemId}
          isDropArea={isEditMode && item.id===dndTargetListItemId}
          onDragStart={onItemDragStart}
          onDragEnd={onItemDragEnd}
          onDragEnter={onItemDragEnter}
          onDragLeave={onItemDragLeave}
          onDragOver={onItemDragOver}
          onDrop={onItemDrop}
          onContextMenu={onItemContextMenu}
        />
      })}
      </ul>
    )
  }

  return memo(Shelf);
}
