/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';
import { WorkflowSettings } from '@/base/workflow';

type Deps = {
  appStore: AppStore;
}

export function createUpdateWorkflowSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = (settings: WorkflowSettings) => {
    const state = appStore.get();
    const { workflow } = state.ui.modalScreens.data.workflowSettings;
    if (!workflow) {
      return;
    }
    appStore.set(modalScreensStateActions.updateModalScreen(state, 'workflowSettings', { workflow: { ...workflow, settings } }));
  }

  return useCase;
}

export type UpdateWorkflowSettingsUseCase = ReturnType<typeof createUpdateWorkflowSettingsUseCase>;
