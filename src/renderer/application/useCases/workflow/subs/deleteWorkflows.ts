/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { deactivateWorkflowSubCase } from '@/application/useCases/memSaver/subs/deactivateWorkflow';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { EntityId } from '@/base/entity';
import { EntityIdList, findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { entityStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';

export function deleteWorkflowsSubCase(
  workflowIdsToDelete: EntityIdList,
  ownerProjectId: EntityId,
  appState: AppState,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase
): AppState {
  const ownerProject = entityStateActions.projects.getOne(appState, ownerProjectId);
  if (ownerProject) {
    let { workflowIds, currentWorkflowId } = ownerProject;

    for (const wflId of workflowIdsToDelete) {
      const removeIdx = findIdIndexOnList(workflowIds, wflId);
      if (removeIdx > -1) {
        const wfl = entityStateActions.workflows.getOne(appState, wflId);
        workflowIds = removeIdFromListAtIndex(workflowIds, removeIdx);
        if (wfl) {
          // Delete widgets
          const wflWidgetIdsToDelete = wfl.layout.map(item => item.widgetId);
          appState = entityStateActions.widgets.removeMany(appState, wflWidgetIdsToDelete);

          // Shift current workflow if needed
          if (wflId === currentWorkflowId) {
            currentWorkflowId = workflowIds[Math.min(removeIdx, workflowIds.length - 1)] || '';
          }

          // Deactivate deleted workflows
          appState = {
            ...appState,
            ui: {
              ...appState.ui,
              memSaver: deactivateWorkflowSubCase(wflId, appState.ui.memSaver)
            }
          }
        }
        appState = entityStateActions.workflows.removeOne(appState, wflId);
      }
    }
    appState = entityStateActions.projects.updateOne(appState, {
      id: ownerProjectId,
      changes: {
        workflowIds,
      }
    })
    appState = setCurrentWorkflowSubCase(appState, deactivateWorkflowUseCase, ownerProjectId, currentWorkflowId, true);
  }

  return appState;
}
