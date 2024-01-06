/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createOpenProjectManagerUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const projects = state.entities.projects;
    const { currentProjectId, projectIds } = state.ui.projectSwitcher;

    state = modalScreensStateActions.resetAll(state);
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectManager: {
          ...state.ui.projectManager,
          currentProjectId,
          projects,
          deleteProjectIds: {},
          projectIds
        }
      }
    })
  }

  return useCase;
}

export type OpenProjectManagerUseCase = ReturnType<typeof createOpenProjectManagerUseCase>;
