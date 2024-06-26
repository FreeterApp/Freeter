/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetLayoutItemComponent } from '@/ui/components/worktable/widgetLayout/widgetLayoutItem';
import WidgetLayoutItemGhost from '@/ui/components/worktable/widgetLayout/widgetLayoutItemGhost';
import { WidgetLayoutViewModel, WidgetLayoutProps } from '@/ui/components/worktable/widgetLayout/widgetLayoutViewModel';
import clsx from 'clsx';
import { memo, useRef } from 'react';
import * as styles from './widgetLayout.module.scss';
import { InAppNote } from '@/ui/components/basic/inAppNote';
import { SvgIcon } from '@/ui/components/basic/svgIcon';
import { editMode24Svg } from '@/ui/assets/images/appIcons';

type Deps = {
  WidgetLayoutItem: WidgetLayoutItemComponent,
  useWidgetLayoutViewModel: WidgetLayoutViewModel;
}

export function createWidgetLayoutComponent({
  WidgetLayoutItem,
  useWidgetLayoutViewModel
}: Deps) {
  function WidgetLayoutComponent(props: WidgetLayoutProps) {
    const layoutEl = useRef<HTMLDivElement>(null);

    const {
      componentMounted,
      env,
      isVisible,
      isEditMode,
      viewportSize,
      viewLayoutItems,
      resizingItem,
      dndIsDropArea,
      dndDraggingLayoutItemId,
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
      onContextMenu,
    } = useWidgetLayoutViewModel(layoutEl, props);

    return componentMounted ? (<>
      {isVisible && showNoWidgetsNote && (
        !isEditMode
        ? <InAppNote className={styles['no-widgets']}>
            {'The workflow is empty. Enable Edit Mode with '}
            <SvgIcon svg={editMode24Svg} className={styles['edit-mode-icon']} />
            {' button at the Top Bar to edit it.'}
          </InAppNote>
        : <InAppNote className={styles['no-widgets']}>
            {'Click or drag a widget from the Add/Paste Widget at the Top Bar to add it to the workflow.'}
          </InAppNote>
      )}
      <div
        className={clsx(styles.widgetLayout, dndIsDropArea && styles['is-drop-area'], isVisible && styles['is-visible'])}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        ref={layoutEl}
        onContextMenu={onContextMenu}
        data-testid="widget-layout"
        {...{ inert: !isVisible ? '' : undefined }}
      >
        { ghostItemRect && <WidgetLayoutItemGhost
          w={ghostItemRect.w}
          h={ghostItemRect.h}
          x={ghostItemRect.x}
          y={ghostItemRect.y}
          viewportSize={viewportSize}
        />}
        {env && viewLayoutItems?.map(layoutItem => (
          <WidgetLayoutItem
            key={layoutItem.id}
            id={layoutItem.id}
            w={layoutItem.rect.w}
            h={layoutItem.rect.h}
            x={layoutItem.rect.x}
            y={layoutItem.rect.y}
            env={env}
            widgetId={layoutItem.widgetId}
            viewportSize={viewportSize}
            viewportElRef={layoutEl}
            resizingMinSize={resizingItem?.minSize}
            isEditable={isEditMode}
            isDragging={layoutItem.id===dndDraggingLayoutItemId}
            onDragStart={onItemDragStart}
            onDragEnd={onItemDragEnd}
            onResizeStart={onItemResizeStart}
            onResize={onItemResize}
            onResizeEnd={onItemResizeEnd}
          />
        ))}
      </div>
    </>) : (
      <div
        className={styles.widgetLayout}
        ref={layoutEl}
      />
    )

  }

  return memo(WidgetLayoutComponent);
}
