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

export function createToggleDeletionInProjectManagerUseCase({
  appStore
}: Deps) {
  const useCase = (projectId: EntityId) => {
    const state = appStore.get();
    const { deleteProjectIds } = state.ui.modalScreens.data.projectManager;
    if (deleteProjectIds) {
      appStore.set(modalScreensStateActions.updateModalScreen(state, 'projectManager', {
        deleteProjectIds: {
          ...deleteProjectIds,
          [projectId]: !deleteProjectIds[projectId]
        },
      }));
    }
  }

  return useCase;
}

export type ToggleDeletionInProjectManagerUseCase = ReturnType<typeof createToggleDeletionInProjectManagerUseCase>;
