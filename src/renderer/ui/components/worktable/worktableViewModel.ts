/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
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
      workflows,
      resizingItem,
      dndDraggingFrom,
      dndDraggingWidgetType,
      dndOverWorktableLayout,
    } = useAppState(state => {
      const { editMode: isEditMode } = state.ui;
      const { currentProjectId } = state.ui.projectSwitcher;
      const widgetCopies = state.ui.copy.widgets.entities;
      const currentWorkflowId = state.entities.projects[currentProjectId]?.currentWorkflowId;
      const workflows = mapIdListToEntityList(state.entities.workflows, state.entities.projects[currentProjectId]?.workflowIds || []);
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
      return {
        isEditMode,
        currentProjectId,
        currentWorkflowId,
        workflows,
        resizingItem,
        dndDraggingFrom,
        dndDraggingWidgetType,
        dndOverWorktableLayout,
      }
    });

    const noWorkflows = workflows.length === 0;

    return {
      isEditMode,
      currentProjectId,
      currentWorkflowId,
      workflows,
      noWorkflows,
      resizingItem,
      dndDraggingFrom,
      dndDraggingWidgetType,
      dndOverWorktableLayout,
    }
  }

  return useWorktableViewModel;
}

export type WorktableViewModel = ReturnType<typeof createWorktableViewModelHook>;
