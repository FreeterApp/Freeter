/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createSaveWorkflowSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const { workflow } = state.ui.workflowSettings;
    if (!workflow) {
      return;
    }
    state = entityStateActions.workflows.updateOne(state, {
      id: workflow.id,
      changes: {
        settings: workflow.settings
      }
    })
    state = {
      ...state,
      ui: {
        ...state.ui,
        workflowSettings: {
          ...state.ui.workflowSettings,
          workflow: null
        }
      }
    }
    appStore.set(state);
  }

  return useCase;
}

export type SaveWorkflowSettingsUseCase = ReturnType<typeof createSaveWorkflowSettingsUseCase>;
