/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { AddWidgetToShelfUseCase } from '@/application/useCases/shelf/addWidgetToShelf';
import { PasteWidgetToShelfUseCase } from '@/application/useCases/shelf/pasteWidgetToShelf';
import { AddWidgetToWorkflowUseCase } from '@/application/useCases/workflow/addWidgetToWorkflow';
import { PasteWidgetToWorkflowUseCase } from '@/application/useCases/workflow/pasteWidgetToWorkflow';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { UseAppState } from '@/ui/hooks/appState';
import { MenuItems } from '@common/base/menu';
import { useCallback, useMemo } from 'react';

type Deps = {
  useAppState: UseAppState;
  dragWidgetFromPaletteUseCase: DragWidgetFromPaletteUseCase;
  dragEndUseCase: DragEndUseCase;
  addWidgetToWorkflowUseCase: AddWidgetToWorkflowUseCase;
  pasteWidgetToWorkflowUseCase: PasteWidgetToWorkflowUseCase;
  addWidgetToShelfUseCase: AddWidgetToShelfUseCase;
  pasteWidgetToShelfUseCase: PasteWidgetToShelfUseCase;
  showContextMenuUseCase: ShowContextMenuUseCase;
}

export function createPaletteViewModelHook({
  useAppState,
  dragWidgetFromPaletteUseCase,
  dragEndUseCase,
  addWidgetToWorkflowUseCase,
  pasteWidgetToWorkflowUseCase,
  addWidgetToShelfUseCase,
  pasteWidgetToShelfUseCase,
  showContextMenuUseCase,
}: Deps) {

  const createAddContextMenuItemsEditMode: (
    widgetTypeId: EntityId,
    toWorkflowId: EntityId,
  ) => MenuItems = (widgetTypeId, toWorkflowId) => [{
    enabled: true,
    label: 'Add to Workflow',
    doAction: async () => {
      addWidgetToWorkflowUseCase(widgetTypeId, toWorkflowId);
    }
  }, {
    enabled: true,
    label: 'Add to Shelf',
    doAction: async () => {
      addWidgetToShelfUseCase(widgetTypeId, null);
    }
  }]

  const createPasteContextMenuItemsEditMode: (
    widgetCopyId: EntityId,
    toWorkflowId: EntityId,
  ) => MenuItems = (widgetCopyId, toWorkflowId) => [{
    enabled: true,
    label: 'Paste to Workflow',
    doAction: async () => {
      pasteWidgetToWorkflowUseCase(widgetCopyId, toWorkflowId);
    }
  }, {
    enabled: true,
    label: 'Paste to Shelf',
    doAction: async () => {
      pasteWidgetToShelfUseCase(widgetCopyId, null);
    }
  }]

  function useViewModel() {
    const [
      widgetTypeIds,
      dndSourceTypeId,
      currentWorkflowId,
      copiedWidgetIds,
      copiedWidgetEntities,
      widgetTypeEntities,
      hasDragDropFrom,
      isEditMode
    ] = useAppState(state => {
      const currentProjectId = state.ui.projectSwitcher.currentProjectId;
      const currentProject = getOneFromEntityCollection(state.entities.projects, currentProjectId);
      return [
        state.ui.palette.widgetTypeIds,
        state.ui.dragDrop.from?.palette?.widgetTypeId,
        currentProject?.currentWorkflowId || '',
        state.ui.copy.widgets.list,
        state.ui.copy.widgets.entities,
        state.entities.widgetTypes,
        !!state.ui.dragDrop.from,
        state.ui.editMode
      ]
    })

    const hideSections = hasDragDropFrom;

    const widgetTypes = useAppState.useEntityList(state => state.entities.widgetTypes, widgetTypeIds);
    type CopiedWidget = {
      id: EntityId;
      name: string;
      icon: string;
    }
    const copiedWidgets = useMemo(() => mapIdListToEntityList(copiedWidgetEntities, copiedWidgetIds).map(item => {
      const { id, type } = item.entity;
      const { name } = item.entity.coreSettings;
      const widgetType = widgetTypeEntities[type];
      if (!widgetType) {
        return undefined
      }
      const wgt: CopiedWidget = {
        id,
        name,
        icon: widgetType.icon
      }
      return wgt;
    }).filter(item => item) as CopiedWidget[], [copiedWidgetEntities, copiedWidgetIds, widgetTypeEntities])

    const onAddItemDragStart = useCallback((itemId: string) => {
      dragWidgetFromPaletteUseCase({ widgetTypeId: itemId });
    }, [])

    const onAddItemDragEnd = useCallback(() => {
      dragEndUseCase();
    }, [])

    const onAddItemClick = useCallback((itemId: string) => {
      addWidgetToWorkflowUseCase(itemId, currentWorkflowId);
    }, [currentWorkflowId])

    const onPasteItemDragStart = useCallback((itemId: string) => {
      dragWidgetFromPaletteUseCase({ widgetCopyId: itemId });
    }, [])

    const onPasteItemDragEnd = useCallback(() => {
      dragEndUseCase();
    }, [])

    const onPasteItemClick = useCallback((itemId: string) => {
      pasteWidgetToWorkflowUseCase(itemId, currentWorkflowId);
    }, [currentWorkflowId])

    const onAddContextMenu = useCallback((widgetTypeId: EntityId) => {
      if (isEditMode) {
        const contextMenuItems: MenuItems = createAddContextMenuItemsEditMode(widgetTypeId, currentWorkflowId);
        showContextMenuUseCase(contextMenuItems);
      }
    }, [currentWorkflowId, isEditMode])

    const onPasteContextMenu = useCallback((widgetCopyId: EntityId) => {
      if (isEditMode) {
        const contextMenuItems: MenuItems = createPasteContextMenuItemsEditMode(widgetCopyId, currentWorkflowId);
        showContextMenuUseCase(contextMenuItems);
      }
    }, [currentWorkflowId, isEditMode])

    return {
      widgetTypes,
      dndSourceTypeId,
      copiedWidgets,
      hideSections,
      onAddItemDragStart,
      onAddItemDragEnd,
      onAddItemClick,
      onPasteItemDragStart,
      onPasteItemDragEnd,
      onPasteItemClick,
      onAddContextMenu,
      onPasteContextMenu,
    }
  }

  return useViewModel;
}

export type PaletteViewModelHook = ReturnType<typeof createPaletteViewModelHook>;
export type PaletteViewModel = ReturnType<PaletteViewModelHook>;
