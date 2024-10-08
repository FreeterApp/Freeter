/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { EntityId } from '@/base/entity';
import { entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createSwitchWorkflowUseCase({
  appStore,
}: Deps) {
  const useCase = (projectId: EntityId, workflowId: EntityId) => {
    const state = appStore.get();
    const project = entityStateActions.projects.getOne(state, projectId);
    if (project) {
      const [updPrj] = setCurrentWorkflowSubCase(project, workflowId);
      appStore.set(entityStateActions.projects.setOne(state, updPrj))
    }
  }

  return useCase;
}

export type SwitchWorkflowUseCase = ReturnType<typeof createSwitchWorkflowUseCase>;
