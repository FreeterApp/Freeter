/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { AppSettings } from '@/base/app';
import { EntityId } from '@/base/entity';
import { updateOneInEntityCollection } from '@/base/entityCollection';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createUpdateAppSettingsInAppManagerUseCase({
  appStore,
}: Deps) {
  const useCase = (appId: EntityId, settings: AppSettings) => {
    const state = appStore.get();
    const { apps } = state.ui.modalScreens.data.appManager;
    if (apps === null) {
      return;
    }

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'appManager', {
      apps: updateOneInEntityCollection(apps, {
        id: appId,
        changes: { settings }
      })
    }));
  }

  return useCase;
}

export type UpdateAppSettingsInAppManagerUseCase = ReturnType<typeof createUpdateAppSettingsInAppManagerUseCase>;
