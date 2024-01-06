/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { entityStateActions, modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createOpenWorkflowSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = (workflowId: EntityId) => {
    let state = appStore.get();
    const workflow = entityStateActions.workflows.getOne(state, workflowId);

    if (workflow) {
      state = modalScreensStateActions.resetAll(state);
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          workflowSettings: {
            ...state.ui.workflowSettings,
            workflow
          }
        }
      })
    }
  }

  return useCase;
}

export type OpenWorkflowSettingsUseCase = ReturnType<typeof createOpenWorkflowSettingsUseCase>;
