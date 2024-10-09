/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { UseAppState } from '@/ui/hooks/appState';

type Deps = {
  useAppState: UseAppState;
}

export function createWorktableViewModelHook({
  useAppState,
}: Deps) {
  function useWorktableViewModel() {
    const {
      isEditMode,
      currentProjectId,
      currentWorkflowId,
      activeWorkflowIds,
      resizingItem,
      dndDraggingFrom,
      dndDraggingWidgetType,
      dndOverWorktableLayout,
      copiedWidgetIds,
      widgetTypeIds,
    } = useAppState(state => {
      const { editMode: isEditMode } = state.ui;
      const { currentProjectId } = state.ui.projectSwitcher;
      const widgetCopies = state.ui.copy.widgets.entities;
      const currentWorkflowId = state.entities.projects[currentProjectId]?.currentWorkflowId;
      const activeWorkflowIds = state.ui.memSaver.activeWorkflowIds;
      const { resizingItem } = state.ui.worktable;
      const dndDraggingFrom = state.ui.dragDrop.from;
      const dndOverWorktableLayout = state.ui.dragDrop.over?.worktableLayout;
      let widgetTypeId: EntityId | undefined;
      if (dndDraggingFrom?.palette) {
        if (dndDraggingFrom.palette.widgetTypeId) {
          widgetTypeId = dndDraggingFrom.palette.widgetTypeId;
        } else if (dndDraggingFrom.palette.widgetCopyId) {
          widgetTypeId = widgetCopies[dndDraggingFrom.palette.widgetCopyId]?.entity.type;
        }
      } else if (dndDraggingFrom?.topBarList) {
        widgetTypeId = getOneFromEntityCollection(state.entities.widgets, dndDraggingFrom.topBarList.widgetId)?.type;
      } else if (dndDraggingFrom?.worktableLayout) {
        widgetTypeId = getOneFromEntityCollection(state.entities.widgets, dndDraggingFrom.worktableLayout.widgetId)?.type
      }
      const dndDraggingWidgetType = widgetTypeId ? getOneFromEntityCollection(state.entities.widgetTypes, widgetTypeId) : undefined;
      const widgetTypeIds = state.ui.palette.widgetTypeIds;
      const copiedWidgetIds = state.ui.copy.widgets.list;
      return {
        isEditMode,
        currentProjectId,
        currentWorkflowId,
        activeWorkflowIds,
        resizingItem,
        dndDraggingFrom,
        dndDraggingWidgetType,
        dndOverWorktableLayout,
        copiedWidgetIds,
        widgetTypeIds,
      }
    });

    const activeWorkflows = useAppState.useEntityList(state => state.entities.workflows, activeWorkflowIds || []);
    const widgetTypes = useAppState.useEntityList(state => state.entities.widgetTypes, widgetTypeIds);
    const copiedWidgets = useAppState.useEntityList(state => state.ui.copy.widgets.entities, copiedWidgetIds);

    const noWorkflows = activeWorkflows.length === 0;

    return {
      isEditMode,
      currentProjectId,
      currentWorkflowId,
      activeWorkflows,
      noWorkflows,
      resizingItem,
      dndDraggingFrom,
      dndDraggingWidgetType,
      dndOverWorktableLayout,
      widgetTypes,
      copiedWidgets,
    }
  }

  return useWorktableViewModel;
}

export type WorktableViewModel = ReturnType<typeof createWorktableViewModelHook>;
