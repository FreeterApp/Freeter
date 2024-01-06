/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
}

export function createToggleDeletionInProjectManagerUseCase({
  appStore
}: Deps) {
  const useCase = (projectId: EntityId) => {
    const state = appStore.get();
    if (state.ui.projectManager.deleteProjectIds) {
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          projectManager: {
            ...state.ui.projectManager,
            deleteProjectIds: {
              ...state.ui.projectManager.deleteProjectIds,
              [projectId]: !state.ui.projectManager.deleteProjectIds[projectId]
            },
          }
        }
      });
    }
  }

  return useCase;
}

export type ToggleDeletionInProjectManagerUseCase = ReturnType<typeof createToggleDeletionInProjectManagerUseCase>;
