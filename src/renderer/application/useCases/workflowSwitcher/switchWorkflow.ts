/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
}
export function createSwitchWorkflowUseCase({
  appStore,
}: Deps) {
  const useCase = (projectId: EntityId, workflowId: EntityId) => {
    let state = appStore.get();
    state = setCurrentWorkflowSubCase(state, projectId, workflowId, true);
    appStore.set(state);
  }

  return useCase;
}

export type SwitchWorkflowUseCase = ReturnType<typeof createSwitchWorkflowUseCase>;
