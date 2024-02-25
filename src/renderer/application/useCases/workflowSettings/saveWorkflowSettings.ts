/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { entityStateActions, modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createSaveWorkflowSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const { workflow } = state.ui.modalScreens.data.workflowSettings;
    if (!workflow) {
      return;
    }
    state = entityStateActions.workflows.updateOne(state, {
      id: workflow.id,
      changes: {
        settings: workflow.settings
      }
    })
    state = modalScreensStateActions.closeModalScreen(state, 'workflowSettings');
    appStore.set(state);
  }

  return useCase;
}

export type SaveWorkflowSettingsUseCase = ReturnType<typeof createSaveWorkflowSettingsUseCase>;
