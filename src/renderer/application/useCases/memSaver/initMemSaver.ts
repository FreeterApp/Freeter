/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { activateProjectWorkflowsSubCase } from '@/application/useCases/memSaver/subs/activateProjectWorkflows';
import { mapIdListToEntityList } from '@/base/entityList';
import { entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase;
}

export function createInitMemSaverUseCase({
  appStore,
  deactivateWorkflowUseCase
}: Deps) {
  const useCase = () => {
    const appState = appStore.get();
    const currentProject = entityStateActions.projects.getOne(appState, appState.ui.projectSwitcher.currentProjectId)
    if (currentProject) {
      const projectWorkflows = mapIdListToEntityList(appState.entities.workflows, currentProject.workflowIds);

      const newMemSaverState = activateProjectWorkflowsSubCase(
        projectWorkflows,
        currentProject.currentWorkflowId,
        appState.ui.appConfig.memSaver,
        currentProject.settings.memSaver,
        appState.ui.memSaver,
        deactivateWorkflowUseCase
      )

      appStore.set({
        ...appState,
        ui: {
          ...appState.ui,
          memSaver: newMemSaverState
        }
      });
    }
  }

  return useCase;
}

export type InitMemSaverUseCase = ReturnType<typeof createInitMemSaverUseCase>;
