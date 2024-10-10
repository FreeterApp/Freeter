/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase;
}
export function createSwitchWorkflowUseCase({
  appStore,
  deactivateWorkflowUseCase,
}: Deps) {
  const useCase = (projectId: EntityId, workflowId: EntityId) => {
    let state = appStore.get();
    state = setCurrentWorkflowSubCase(state, deactivateWorkflowUseCase, projectId, workflowId, true);
    appStore.set(state);
  }

  return useCase;
}

export type SwitchWorkflowUseCase = ReturnType<typeof createSwitchWorkflowUseCase>;
