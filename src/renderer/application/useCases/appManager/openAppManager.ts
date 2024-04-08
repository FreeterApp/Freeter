/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createOpenAppManagerUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const { apps } = state.entities;
    const { appIds } = state.ui.apps;

    state = modalScreensStateActions.openModalScreen(state, 'appManager', {
      apps,
      deleteAppIds: {},
      appIds,
      currentAppId: '',
    });
    appStore.set(state);
  }

  return useCase;
}

export type OpenAppManagerUseCase = ReturnType<typeof createOpenAppManagerUseCase>;
