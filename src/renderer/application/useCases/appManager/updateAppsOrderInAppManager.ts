/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityIdList } from '@/base/entityList';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createUpdateAppsOrderInAppManagerUseCase({
  appStore,
}: Deps) {
  const useCase = (appIds: EntityIdList) => {
    const state = appStore.get();
    if (state.ui.modalScreens.data.appManager.appIds === null) {
      return;
    }

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'appManager', {
      appIds
    }));
  }

  return useCase;
}

export type UpdateAppsOrderInAppManagerUseCase = ReturnType<typeof createUpdateAppsOrderInAppManagerUseCase>;
