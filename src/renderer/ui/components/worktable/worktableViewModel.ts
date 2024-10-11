/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { Workflow } from '@/base/workflow';
import { UseAppState } from '@/ui/hooks/appState';
import { useMemo } from 'react';

type Deps = {
  useAppState: UseAppState;
}

export function createWorktableViewModelHook({
  useAppState,
}: Deps) {
  function useWorktableViewModel() {
    const {
      isEditMode,
      currentWorkflowId,
      workflows,
      _activeWorkflows,
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
      const workflows = state.entities.workflows;
      const _activeWorkflows = state.ui.memSaver.activeWorkflows;
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
        currentWorkflowId,
        workflows,
        _activeWorkflows,
        resizingItem,
        dndDraggingFrom,
        dndDraggingWidgetType,
        dndOverWorktableLayout,
        copiedWidgetIds,
        widgetTypeIds,
      }
    });

    const activeWorkflows = useMemo(
      () => _activeWorkflows
        .map(({ wflId, prjId }) => ({
          prjId,
          wfl: getOneFromEntityCollection(workflows, wflId)
        }))
        .filter(({ wfl }) => wfl !== undefined) as {
          prjId: string;
          wfl: Workflow;
        }[],
      [_activeWorkflows, workflows]
    )

    const widgetTypes = useAppState.useEntityList(state => state.entities.widgetTypes, widgetTypeIds);
    const copiedWidgets = useAppState.useEntityList(state => state.ui.copy.widgets.entities, copiedWidgetIds);

    const noWorkflows = activeWorkflows.length === 0;

    return {
      isEditMode,
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
