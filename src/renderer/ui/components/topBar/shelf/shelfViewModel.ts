/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { DragOverTopBarListUseCase } from '@/application/useCases/dragDrop/dragOverTopBarList';
import { DragWidgetFromTopBarListUseCase } from '@/application/useCases/dragDrop/dragWidgetFromTopBarList';
import { DropOnTopBarListUseCase } from '@/application/useCases/dragDrop/dropOnTopBarList';
import { DragEvent, MouseEvent, UIEvent, useCallback, useState } from 'react';
import { UseAppState } from '@/ui/hooks/appState';
import { Widget, WidgetEnvAreaShelf, createWidgetEnv } from '@/base/widget';
import { MenuItem, MenuItems } from '@common/base/menu';
import { EntityId } from '@/base/entity';
import { EntityList, mapIdListToEntityList } from '@/base/entityList';
import { CopiedEntitiesItem } from '@/base/state/ui';
import { WidgetEntityDeps } from '@/base/state/entities';
import { PasteWidgetToShelfUseCase } from '@/application/useCases/shelf/pasteWidgetToShelf';
import { WidgetType } from '@/base/widgetType';
import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { AddWidgetToShelfUseCase } from '@/application/useCases/shelf/addWidgetToShelf';

type Deps = {
  useAppState: UseAppState;
  dragWidgetFromTopBarListUseCase: DragWidgetFromTopBarListUseCase;
  dragOverTopBarListUseCase: DragOverTopBarListUseCase;
  dragLeaveTargetUseCase: DragLeaveTargetUseCase;
  dropOnTopBarListUseCase: DropOnTopBarListUseCase;
  dragEndUseCase: DragEndUseCase;
  pasteWidgetToShelfUseCase: PasteWidgetToShelfUseCase;
  addWidgetToShelfUseCase: AddWidgetToShelfUseCase;
  showContextMenuUseCase: ShowContextMenuUseCase;
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
  pasteWidgetToShelfUseCase,
  addWidgetToShelfUseCase,
  showContextMenuUseCase,
}: Deps) {
  function buildAddMenuItems(
    widgetTypes: EntityList<WidgetType>,
    posByListItemId: EntityId | null
  ): MenuItem[] {
    return widgetTypes.length === 0
      ? [{ enabled: false, label: 'No widgets to add' }]
      : widgetTypes.map(item => ({
        enabled: true,
        label: item.name,
        doAction: async () => {
          addWidgetToShelfUseCase(item.id, posByListItemId);
        }
      }))
  }

  function buildPasteMenuItems(
    copiedWidgets: EntityList<CopiedEntitiesItem<Widget, WidgetEntityDeps>>,
    posByListItemId: EntityId | null
  ): MenuItem[] {
    return copiedWidgets.length === 0
      ? [{ enabled: false, label: 'No widgets to paste' }]
      : copiedWidgets.map(item => ({
        enabled: true,
        label: item.entity.coreSettings.name,
        doAction: async () => {
          pasteWidgetToShelfUseCase(item.id, posByListItemId);
        }
      }))
  }
  const createContextMenuItemsEditMode: (
    widgetTypes: EntityList<WidgetType>,
    copiedWidgets: EntityList<CopiedEntitiesItem<Widget, WidgetEntityDeps>>,
  ) => MenuItems = (widgetTypes, copiedWidgets) => [{
    enabled: true,
    label: 'Add Widget...',
    submenu: buildAddMenuItems(widgetTypes, null)
  }, {
    enabled: true,
    label: 'Paste Widget...',
    submenu: buildPasteMenuItems(copiedWidgets, null)
  }]

  const createItemContextMenuItemsEditMode: (
    id: EntityId,
    widgetTypes: EntityList<WidgetType>,
    copiedWidgets: EntityList<CopiedEntitiesItem<Widget, WidgetEntityDeps>>,
  ) => MenuItems = (id, widgetTypes, copiedWidgets) => [{
    enabled: true,
    label: 'Add Widget...',
    submenu: buildAddMenuItems(widgetTypes, id)
  }, {
    enabled: true,
    label: 'Paste Widget...',
    submenu: buildPasteMenuItems(copiedWidgets, id)
  }]

  function useViewModel() {
    const {
      isEditMode,
      widgetsById,
      widgetTypesById,
      widgetList,
      dndSourceListItemId,
      dndTargetListItemId,
      hasDragDropFrom,
      hasWorktableResizingItem,
      widgetTypes,
      copiedWidgets,
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
      const widgetTypes = mapIdListToEntityList(state.entities.widgetTypes, state.ui.palette.widgetTypeIds);
      const copiedWidgets = mapIdListToEntityList(state.ui.copy.widgets.entities, state.ui.copy.widgets.list);
      return {
        isEditMode,
        widgetsById,
        widgetTypesById,
        widgetList,
        dndSourceListItemId,
        dndTargetListItemId,
        hasDragDropFrom,
        hasWorktableResizingItem,
        widgetTypes,
        copiedWidgets
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

    const onContextMenu: React.MouseEventHandler<HTMLUListElement> = useCallback((_) => {
      if (isEditMode) {
        const contextMenuItems: MenuItems = createContextMenuItemsEditMode(widgetTypes, copiedWidgets);
        showContextMenuUseCase(contextMenuItems);
      }
    }, [copiedWidgets, isEditMode, widgetTypes])

    const onItemContextMenu = useCallback((e: MouseEvent<HTMLElement>, itemId: EntityId) => {
      if (isEditMode) {
        const contextMenuItems: MenuItems = createItemContextMenuItemsEditMode(itemId, widgetTypes, copiedWidgets);
        showContextMenuUseCase(contextMenuItems);
      }
    }, [copiedWidgets, isEditMode, widgetTypes])

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
      onContextMenu,
      onItemContextMenu,
    }
  }

  return useViewModel;
}

export type ShelfViewModelHook = ReturnType<typeof createShelfViewModelHook>;
export type ShelfViewModel = ReturnType<ShelfViewModelHook>;
