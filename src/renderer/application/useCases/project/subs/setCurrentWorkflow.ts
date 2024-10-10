/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { activateWorkflowSubCase } from '@/application/useCases/memSaver/subs/activateWorkflow';
import { scheduleWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/scheduleWorkflowDeactivation';
import { EntityId } from '@/base/entity';
import { entityStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';

export function setCurrentWorkflowSubCase(
  appState: AppState,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase,
  projectId: EntityId,
  newCurrentWorkflowId: EntityId,
  activate: boolean,
): AppState {
  const project = entityStateActions.projects.getOne(appState, projectId)
  if (project) {
    const { currentWorkflowId } = project;
    if (currentWorkflowId !== newCurrentWorkflowId) {
      if (activate) {
        let updMemSaver = appState.ui.memSaver;
        updMemSaver = activateWorkflowSubCase(projectId, newCurrentWorkflowId, updMemSaver);
        const workflow = entityStateActions.workflows.getOne(appState, currentWorkflowId);
        if (workflow) {
          updMemSaver = scheduleWorkflowDeactivationSubCase(
            currentWorkflowId,
            updMemSaver,
            appState.ui.appConfig.memSaver,
            project.settings.memSaver,
            workflow.settings.memSaver,
            deactivateWorkflowUseCase
          )
        }
        appState = {
          ...appState,
          ui: {
            ...appState.ui,
            memSaver: updMemSaver
          }
        }
      }
      appState = entityStateActions.projects.updateOne(appState, {
        id: projectId,
        changes: {
          currentWorkflowId: newCurrentWorkflowId
        }
      })
    }
  }

  return appState;
}
