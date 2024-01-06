/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { addOneToEntityCollection, getEntitiesArrayFromEntityCollection } from '@/base/entityCollection';
import { createProject, generateProjectName } from '@/base/project';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createAddProjectInProjectManagerUseCase({
  appStore,
  idGenerator
}: Deps) {
  const useCase = () => {
    const state = appStore.get();
    if (state.ui.projectManager.projects !== null && state.ui.projectManager.projectIds !== null) {
      const newItemId = idGenerator();
      const newProject = createProject(newItemId, generateProjectName(getEntitiesArrayFromEntityCollection(state.ui.projectManager.projects).map(item => item?.settings.name || '')))
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          projectManager: {
            ...state.ui.projectManager,
            currentProjectId: newItemId,
            projects: addOneToEntityCollection(state.ui.projectManager.projects, newProject),
            projectIds: [...state.ui.projectManager.projectIds, newItemId]
          }
        }
      })
      return newItemId;
    }
    return undefined;
  }

  return useCase;
}

export type AddProjectInProjectManagerUseCase = ReturnType<typeof createAddProjectInProjectManagerUseCase>;
