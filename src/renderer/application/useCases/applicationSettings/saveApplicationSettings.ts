/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';

type Deps = {
  appStore: AppStore;
}

export function createSaveApplicationSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const { appConfig } = state.ui.applicationSettings;
    if (!appConfig) {
      return;
    }
    state = {
      ...state,
      ui: {
        ...state.ui,
        appConfig,
        applicationSettings: {
          ...state.ui.applicationSettings,
          appConfig: null
        }
      }
    }
    appStore.set(state);
  }

  return useCase;
}

export type SaveApplicationSettingsUseCase = ReturnType<typeof createSaveApplicationSettingsUseCase>;
