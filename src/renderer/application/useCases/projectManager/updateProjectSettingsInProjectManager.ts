/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { updateOneInEntityCollection } from '@/base/entityCollection';
import { ProjectSettings } from '@/base/project';

type Deps = {
  appStore: AppStore;
}

export function createUpdateProjectSettingsInProjectManagerUseCase({
  appStore,
}: Deps) {
  const useCase = (projectId: EntityId, settings: ProjectSettings) => {
    const state = appStore.get();
    if (state.ui.projectManager.projects === null) {
      return;
    }

    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectManager: {
          ...state.ui.projectManager,
          projects: updateOneInEntityCollection(state.ui.projectManager.projects, {
            id: projectId,
            changes: { settings }
          })
        }
      }
    });
  }

  return useCase;
}

export type UpdateProjectSettingsInProjectManagerUseCase = ReturnType<typeof createUpdateProjectSettingsInProjectManagerUseCase>;
