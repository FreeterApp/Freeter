/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { findIdIndexOnList } from '@/base/entityList';
import { addWorkflowToAppState, copyProjectContentInAppState, deleteProjectsFromAppState, modalScreensStateActions } from '@/base/state/actions';
import { ObjectManager } from '@common/base/objectManager';

type Deps = {
  appStore: AppStore;
  widgetDataStorageManager: ObjectManager<DataStorageRenderer>;
  idGenerator: IdGenerator;
}
export function createSaveChangesInProjectManagerUseCase({
  appStore,
  widgetDataStorageManager,
  idGenerator,
}: Deps) {
  const useCase = async () => {
    let state = appStore.get();
    const prevProjects = state.entities.projects;
    const { deleteProjectIds, projectIds, projects, duplicateProjectIds } = state.ui.modalScreens.data.projectManager;

    if (projects !== null && projectIds !== null && deleteProjectIds !== null && duplicateProjectIds !== null) {
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
        // init a workflow for each newly added, non-duplicate project
        if (!getOneFromEntityCollection(prevProjects, prjId) && !duplicateProjectIds[prjId]) {
          state = addWorkflowToAppState(state, prjId, idGenerator())[0];
        }
      }

      const projectIdsToDel = Object.entries(deleteProjectIds).filter(item => item[1]).map(item => item[0]);
      if (projectIdsToDel.length > 0) {
        state = deleteProjectsFromAppState(state, projectIdsToDel);
      }

      const arrFromIdToId = Object.entries(duplicateProjectIds).map<[string, string]>(([toId, fromId]) => [fromId, toId]);
      if (arrFromIdToId.length > 0) {
        const { newState, newWidgetIds } = copyProjectContentInAppState(state, arrFromIdToId, idGenerator);
        state = newState;
        for (const { origId, newId } of newWidgetIds) {
          await widgetDataStorageManager.copyObjectData(origId, newId);
        }
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
