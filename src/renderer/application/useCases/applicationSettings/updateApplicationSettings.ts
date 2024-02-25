/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { AppConfig } from '@/base/appConfig';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createUpdateApplicationSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = (appConfig: AppConfig) => {
    const state = appStore.get();
    if (!state.ui.modalScreens.data.applicationSettings.appConfig) {
      return;
    }
    appStore.set(modalScreensStateActions.updateModalScreen(state, 'applicationSettings', {
      appConfig
    }));
  }

  return useCase;
}

export type UpdateApplicationSettingsUseCase = ReturnType<typeof createUpdateApplicationSettingsUseCase>;
