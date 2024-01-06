/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createOpenApplicationSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    state = modalScreensStateActions.resetAll(state);
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        applicationSettings: {
          ...state.ui.applicationSettings,
          appConfig: state.ui.appConfig
        }
      }
    })
  }

  return useCase;
}

export type OpenApplicationSettingsUseCase = ReturnType<typeof createOpenApplicationSettingsUseCase>;
