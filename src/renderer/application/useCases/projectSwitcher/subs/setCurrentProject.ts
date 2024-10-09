/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { activateProjectWorkflowsSubCase } from '@/application/useCases/memSaver/subs/activateProjectWorkflows';
import { deactivateProjectWorkflowsSubCase } from '@/application/useCases/memSaver/subs/deactivateProjectWorkflows';
import { EntityId } from '@/base/entity';
import { mapIdListToEntityList } from '@/base/entityList';
import { entityStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';

export function setCurrentProjectSubCase(
  projectId: EntityId,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase,
  appState: AppState
): AppState {
  const { projectSwitcher } = appState.ui;
  if (projectSwitcher.currentProjectId !== projectId) {
    const project = entityStateActions.projects.getOne(appState, projectId);
    if (project) {
      appState = {
        ...appState,
        ui: {
          ...appState.ui,
          memSaver: activateProjectWorkflowsSubCase(
            mapIdListToEntityList(appState.entities.workflows, project.workflowIds),
            project.currentWorkflowId,
            appState.ui.appConfig.memSaver,
            project.settings.memSaver,
            appState.ui.memSaver,
            deactivateWorkflowUseCase
          )
        }
      }
    }

    const curProject = entityStateActions.projects.getOne(appState, projectSwitcher.currentProjectId);
    if (curProject) {
      appState = {
        ...appState,
        ui: {
          ...appState.ui,
          memSaver: deactivateProjectWorkflowsSubCase(
            mapIdListToEntityList(appState.entities.workflows, curProject.workflowIds),
            appState.ui.appConfig.memSaver,
            curProject.settings.memSaver,
            appState.ui.memSaver,
            deactivateWorkflowUseCase
          )
        }
      }
    }

    appState = {
      ...appState,
      ui: {
        ...appState.ui,
        projectSwitcher: {
          ...appState.ui.projectSwitcher,
          currentProjectId: projectId
        }
      }
    }
  }

  return appState;
}
