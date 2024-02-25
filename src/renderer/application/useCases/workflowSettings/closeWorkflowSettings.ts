/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createCloseWorkflowSettingsUseCase({
  appStore
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    state = modalScreensStateActions.closeModalScreen(state, 'workflowSettings');
    appStore.set(state);
  }

  return useCase;
}

export type CloseWorkflowSettingsUseCase = ReturnType<typeof createCloseWorkflowSettingsUseCase>;
