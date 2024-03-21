/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { AddWidgetToWorkflowUseCase } from '@/application/useCases/palette/addWidgetToWorkflow';
import { PasteWidgetToWorkflowUseCase } from '@/application/useCases/workflow/pasteWidgetToWorkflow';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { UseAppState } from '@/ui/hooks/appState';
import { useCallback, useMemo } from 'react';

type Deps = {
  useAppState: UseAppState;
  dragWidgetFromPaletteUseCase: DragWidgetFromPaletteUseCase;
  dragEndUseCase: DragEndUseCase;
  addWidgetToWorkflowWithPaletteUseCase: AddWidgetToWorkflowUseCase;
  pasteWidgetToWorkflowUseCase: PasteWidgetToWorkflowUseCase;
}

export function createPaletteViewModelHook({
  useAppState,
  dragWidgetFromPaletteUseCase,
  dragEndUseCase,
  addWidgetToWorkflowWithPaletteUseCase,
  pasteWidgetToWorkflowUseCase
}: Deps) {
  function useViewModel() {
    const [
      widgetTypeIds,
      dndSourceTypeId,
      currentWorkflowId,
      hasDragDropFrom,
      hasWorktableResizingItem,
      copiedWidgetIds,
      copiedWidgetEntities,
      widgetTypeEntities
    ] = useAppState(state => {
      const currentProjectId = state.ui.projectSwitcher.currentProjectId;
      const currentProject = getOneFromEntityCollection(state.entities.projects, currentProjectId);
      return [
        state.ui.palette.widgetTypeIds,
        state.ui.dragDrop.from?.palette?.widgetTypeId,
        currentProject?.currentWorkflowId || '',
        !!state.ui.dragDrop.from,
        !!state.ui.worktable.resizingItem,
        state.ui.copy.widgets.list,
        state.ui.copy.widgets.entities,
        state.entities.widgetTypes
      ]
    })

    const isHidden = hasDragDropFrom || hasWorktableResizingItem;
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
      addWidgetToWorkflowWithPaletteUseCase(itemId, currentWorkflowId);
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

    return {
      widgetTypes,
      dndSourceTypeId,
      isHidden,
      copiedWidgets,
      onAddItemDragStart,
      onAddItemDragEnd,
      onAddItemClick,
      onPasteItemDragStart,
      onPasteItemDragEnd,
      onPasteItemClick,
    }
  }

  return useViewModel;
}

export type PaletteViewModelHook = ReturnType<typeof createPaletteViewModelHook>;
export type PaletteViewModel = ReturnType<PaletteViewModelHook>;
