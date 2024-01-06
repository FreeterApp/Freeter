/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragWidgetFromPaletteUseCase } from '@/application/useCases/dragDrop/dragWidgetFromPalette';
import { AddWidgetToWorkflowUseCase } from '@/application/useCases/palette/addWidgetToWorkflow';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { UseAppState } from '@/ui/hooks/appState';
import { useCallback } from 'react';

type Deps = {
  useAppState: UseAppState;
  dragWidgetFromPaletteUseCase: DragWidgetFromPaletteUseCase;
  dragEndUseCase: DragEndUseCase;
  addWidgetToWorkflowWithPaletteUseCase: AddWidgetToWorkflowUseCase;
}

export function createPaletteViewModelHook({
  useAppState,
  dragWidgetFromPaletteUseCase,
  dragEndUseCase,
  addWidgetToWorkflowWithPaletteUseCase
}: Deps) {
  function useViewModel() {
    const [
      widgetTypeIds,
      dndSourceTypeId,
      currentWorkflowId,
      hasDragDropFrom,
      hasWorktableResizingItem
    ] = useAppState(state => {
      const currentProjectId = state.ui.projectSwitcher.currentProjectId;
      const currentProject = getOneFromEntityCollection(state.entities.projects, currentProjectId);
      return [
        state.ui.palette.widgetTypeIds,
        state.ui.dragDrop.from?.palette?.widgetTypeId,
        currentProject?.currentWorkflowId || '',
        !!state.ui.dragDrop.from,
        !!state.ui.worktable.resizingItem
      ]
    })

    const isHidden = hasDragDropFrom || hasWorktableResizingItem;
    const widgetTypes = useAppState.useEntityList(state => state.entities.widgetTypes, widgetTypeIds);

    const onItemDragStart = useCallback((itemId: string) => {
      dragWidgetFromPaletteUseCase(itemId);
    }, [])

    const onItemDragEnd = useCallback(() => {
      dragEndUseCase();
    }, [])

    const onItemClick = useCallback((itemId: string) => {
      addWidgetToWorkflowWithPaletteUseCase(itemId, currentWorkflowId);
    }, [currentWorkflowId])

    return {
      widgetTypes,
      dndSourceTypeId,
      isHidden,
      onItemDragStart,
      onItemDragEnd,
      onItemClick
    }
  }

  return useViewModel;
}

export type PaletteViewModelHook = ReturnType<typeof createPaletteViewModelHook>;
export type PaletteViewModel = ReturnType<PaletteViewModelHook>;
