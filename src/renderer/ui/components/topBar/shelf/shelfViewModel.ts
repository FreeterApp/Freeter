/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { DragOverTopBarListUseCase } from '@/application/useCases/dragDrop/dragOverTopBarList';
import { DragWidgetFromTopBarListUseCase } from '@/application/useCases/dragDrop/dragWidgetFromTopBarList';
import { DropOnTopBarListUseCase } from '@/application/useCases/dragDrop/dropOnTopBarList';
import { DragEvent, UIEvent, useCallback, useState } from 'react';
import { UseAppState } from '@/ui/hooks/appState';
import { WidgetEnvAreaShelf, createWidgetEnv } from '@/base/widget';

type Deps = {
  useAppState: UseAppState;
  dragWidgetFromTopBarListUseCase: DragWidgetFromTopBarListUseCase;
  dragOverTopBarListUseCase: DragOverTopBarListUseCase;
  dragLeaveTargetUseCase: DragLeaveTargetUseCase;
  dropOnTopBarListUseCase: DropOnTopBarListUseCase;
  dragEndUseCase: DragEndUseCase;
}

const env: WidgetEnvAreaShelf = createWidgetEnv({
  area: 'shelf'
})

export function createShelfViewModelHook({
  useAppState,
  dragWidgetFromTopBarListUseCase,
  dragOverTopBarListUseCase,
  dragLeaveTargetUseCase,
  dropOnTopBarListUseCase,
  dragEndUseCase,
}: Deps) {
  function useViewModel() {
    const {
      isEditMode,
      widgetsById,
      widgetTypesById,
      widgetList,
      dndSourceListItemId,
      dndTargetListItemId,
      hasDragDropFrom,
      hasWorktableResizingItem
    } = useAppState(state => {
      const isEditMode = state.ui.editMode;
      const widgetsById = state.entities.widgets;
      const widgetTypesById = state.entities.widgetTypes;
      const { widgetList } = state.ui.shelf;
      const { dragDrop } = state.ui;
      const dndSourceListItemId = dragDrop.from?.topBarList?.listItemId;
      const dndTargetListItemId = dragDrop.over?.topBarList
        ? (dragDrop.over.topBarList.listItemId && widgetList.find(item => item.id === dragDrop.over?.topBarList?.listItemId)
          ? dragDrop.over.topBarList.listItemId
          : null)
        : undefined;
      const hasDragDropFrom = !!dragDrop.from;
      const hasWorktableResizingItem = !!state.ui.worktable.resizingItem;
      return {
        isEditMode,
        widgetsById,
        widgetTypesById,
        widgetList,
        dndSourceListItemId,
        dndTargetListItemId,
        hasDragDropFrom,
        hasWorktableResizingItem
      }
    })

    const dontShowWidgets = isEditMode && (hasDragDropFrom || hasWorktableResizingItem);

    const doDragOver = useCallback((evt: DragEvent<HTMLElement>, itemId: string | null) => {
      const canDrop = dragOverTopBarListUseCase(itemId);

      if (canDrop) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
      }
    }, [])

    const onItemDragStart = useCallback((_evt: DragEvent<HTMLElement>, itemId: string) => {
      if (!isEditMode) {
        return;
      }

      const item = widgetList.find(v => v.id === itemId);
      if (!item) {
        return;
      }
      dragWidgetFromTopBarListUseCase(item.widgetId, itemId);
    }, [isEditMode, widgetList])

    const onItemDragEnd = useCallback((_evt: DragEvent<HTMLElement>, _itemId: string) => {
      dragEndUseCase();
    }, [])

    const onItemDragEnter = useCallback((_evt: DragEvent<HTMLElement>, itemId: string) => {
      dragOverTopBarListUseCase(itemId);
    }, [])

    const onItemDragLeave = useCallback((_evt: DragEvent<HTMLElement>, _itemId: string) => {
      dragLeaveTargetUseCase();
    }, [])

    const onItemDragOver = useCallback((evt: DragEvent<HTMLElement>, itemId: string) => {
      doDragOver(evt, itemId);
    }, [doDragOver])

    const onItemDrop = useCallback((_evt: DragEvent<HTMLElement>, itemId: string) => {
      dropOnTopBarListUseCase(itemId);
    }, [])

    const onDragEnter = useCallback((_evt: DragEvent<HTMLElement>) => {
      dragOverTopBarListUseCase(null);
    }, [])

    const onDragLeave = useCallback((_evt: DragEvent<HTMLElement>) => {
      dragLeaveTargetUseCase();
    }, [])

    const onDragOver = useCallback((evt: DragEvent<HTMLElement>) => {
      doDragOver(evt, null);
    }, [doDragOver])

    const onDrop = useCallback((_evt: DragEvent<HTMLElement>) => {
      dropOnTopBarListUseCase(null);
    }, [])

    const [scrollLeft, setScrollLeft] = useState(0);
    const onScroll = useCallback((evt: UIEvent<HTMLElement>) => {
      setScrollLeft(evt.currentTarget.scrollLeft)
    }, [])

    return {
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
    }
  }

  return useViewModel;
}

export type ShelfViewModelHook = ReturnType<typeof createShelfViewModelHook>;
export type ShelfViewModel = ReturnType<ShelfViewModelHook>;
