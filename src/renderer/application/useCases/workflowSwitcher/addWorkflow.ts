/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { addWorkflowToAppState } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createAddWorkflowUseCase({
  appStore,
  idGenerator
}: Deps) {
  const useCase = (posByWorkflowId?: EntityId) => {
    const state = appStore.get();
    const { currentProjectId } = state.ui.projectSwitcher;
    const [newState, newItem] = addWorkflowToAppState(state, currentProjectId, idGenerator(), posByWorkflowId);
    if (newItem) {
      appStore.set(newState);
      return newItem.id;
    }
    return undefined;
  }

  return useCase;
}

export type AddWorkflowUseCase = ReturnType<typeof createAddWorkflowUseCase>;
