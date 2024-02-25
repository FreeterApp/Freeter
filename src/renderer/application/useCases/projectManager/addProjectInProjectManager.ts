/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { addOneToEntityCollection, getEntitiesArrayFromEntityCollection } from '@/base/entityCollection';
import { createProject, generateProjectName } from '@/base/project';
import { modalScreensStateActions } from '@/base/state/actions';

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
    const { projectIds, projects } = state.ui.modalScreens.data.projectManager;
    if (projects !== null && projectIds !== null) {
      const newItemId = idGenerator();
      const newProject = createProject(newItemId, generateProjectName(getEntitiesArrayFromEntityCollection(projects).map(item => item?.settings.name || '')))

      appStore.set(modalScreensStateActions.updateModalScreen(state, 'projectManager', {
        currentProjectId: newItemId,
        projects: addOneToEntityCollection(projects, newProject),
        projectIds: [...projectIds, newItemId]
      }));

      return newItemId;
    }
    return undefined;
  }

  return useCase;
}

export type AddProjectInProjectManagerUseCase = ReturnType<typeof createAddProjectInProjectManagerUseCase>;
