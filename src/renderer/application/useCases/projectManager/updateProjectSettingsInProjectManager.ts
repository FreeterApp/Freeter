/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { updateOneInEntityCollection } from '@/base/entityCollection';
import { ProjectSettings } from '@/base/project';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createUpdateProjectSettingsInProjectManagerUseCase({
  appStore,
}: Deps) {
  const useCase = (projectId: EntityId, settings: ProjectSettings) => {
    const state = appStore.get();
    const { projects } = state.ui.modalScreens.data.projectManager;
    if (projects === null) {
      return;
    }

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'projectManager', {
      projects: updateOneInEntityCollection(projects, {
        id: projectId,
        changes: { settings }
      })
    }));
  }

  return useCase;
}

export type UpdateProjectSettingsInProjectManagerUseCase = ReturnType<typeof createUpdateProjectSettingsInProjectManagerUseCase>;
