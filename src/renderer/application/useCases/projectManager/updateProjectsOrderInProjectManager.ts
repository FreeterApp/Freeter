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

export function createUpdateProjectsOrderInProjectManagerUseCase({
  appStore,
}: Deps) {
  const useCase = (projectIds: EntityIdList) => {
    const state = appStore.get();
    if (state.ui.modalScreens.data.projectManager.projectIds === null) {
      return;
    }

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'projectManager', {
      projectIds
    }));
  }

  return useCase;
}

export type UpdateProjectsOrderInProjectManagerUseCase = ReturnType<typeof createUpdateProjectsOrderInProjectManagerUseCase>;
