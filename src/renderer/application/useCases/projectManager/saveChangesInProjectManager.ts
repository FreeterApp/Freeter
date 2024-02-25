/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { findIdIndexOnList } from '@/base/entityList';
import { addWorkflowToAppState, deleteProjectsFromAppState, modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createSaveChangesInProjectManagerUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const prevProjects = state.entities.projects;
    const { deleteProjectIds, projectIds, projects } = state.ui.modalScreens.data.projectManager;

    if (projects !== null && projectIds !== null && deleteProjectIds !== null) {
      state = {
        ...state,
        entities: {
          ...state.entities,
          projects
        },
        ui: {
          ...state.ui,
          projectSwitcher: {
            ...state.ui.projectSwitcher,
            projectIds
          },
        }
      };
      state = modalScreensStateActions.closeModalScreen(state, 'projectManager');

      for (const prjId of projectIds) {
        if (!getOneFromEntityCollection(prevProjects, prjId)) { // newly added project
          state = addWorkflowToAppState(state, prjId, idGenerator())[0];
        }
      }

      const projectIdsToDel = Object.entries(deleteProjectIds).filter(item => item[1]).map(item => item[0]);
      if (projectIdsToDel.length > 0) {
        state = deleteProjectsFromAppState(state, projectIdsToDel);
      }

      if (findIdIndexOnList(state.ui.projectSwitcher.projectIds, state.ui.projectSwitcher.currentProjectId) < 0) {
        state = {
          ...state,
          ui: {
            ...state.ui,
            projectSwitcher: {
              ...state.ui.projectSwitcher,
              currentProjectId: state.ui.projectSwitcher.projectIds[0] || ''
            }
          }
        }
      }
      appStore.set(state);
    }
  }

  return useCase;
}

export type SaveChangesInProjectManagerUseCase = ReturnType<typeof createSaveChangesInProjectManagerUseCase>;
