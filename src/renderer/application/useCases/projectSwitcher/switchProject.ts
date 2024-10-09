/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { setCurrentProjectSubCase } from '@/application/useCases/projectSwitcher/subs/setCurrentProject';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase;
}
export function createSwitchProjectUseCase({
  appStore,
  deactivateWorkflowUseCase
}: Deps) {
  const useCase = (projectId: EntityId) => {
    let state = appStore.get();
    state = setCurrentProjectSubCase(projectId, deactivateWorkflowUseCase, state);
    appStore.set(state)
  }

  return useCase;
}

export type SwitchProjectUseCase = ReturnType<typeof createSwitchProjectUseCase>;
