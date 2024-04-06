/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createToggleDeletionInAppManagerUseCase({
  appStore
}: Deps) {
  const useCase = (appId: EntityId) => {
    const state = appStore.get();
    const { deleteAppIds } = state.ui.modalScreens.data.appManager;
    if (deleteAppIds) {
      appStore.set(modalScreensStateActions.updateModalScreen(state, 'appManager', {
        deleteAppIds: {
          ...deleteAppIds,
          [appId]: !deleteAppIds[appId]
        },
      }));
    }
  }

  return useCase;
}

export type ToggleDeletionInAppManagerUseCase = ReturnType<typeof createToggleDeletionInAppManagerUseCase>;
