/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getEntitiesArrayFromEntityCollection, getOneFromEntityCollection } from '@/base/entityCollection';
import { createProject } from '@/base/project';
import { modalScreensStateActions } from '@/base/state/actions';
import { generateUniqueName } from '@/base/utils';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}

export function createDuplicateProjectInProjectManagerUseCase({
  appStore,
  idGenerator
}: Deps) {
  const useCase = (projectId: EntityId) => {
    const state = appStore.get();
    const { projectIds, projects, duplicateProjectIds } = state.ui.modalScreens.data.projectManager;
    if (projects === null || projectIds === null || duplicateProjectIds === null) {
      return;
    }

    const duplicateFromId = duplicateProjectIds[projectId] || projectId;

    const duplicateFrom = getOneFromEntityCollection(projects, projectId);
    if (!duplicateFrom) {
      return;
    }

    const newItemId = idGenerator();
    const newProject = createProject(newItemId, generateUniqueName(`${duplicateFrom.settings.name} Copy`, getEntitiesArrayFromEntityCollection(projects).map(item => item?.settings.name || '')))

    appStore.set(modalScreensStateActions.updateModalScreen(state, 'projectManager', {
      currentProjectId: newItemId,
      projects: addOneToEntityCollection(projects, newProject),
      projectIds: [...projectIds, newItemId],
      duplicateProjectIds: {
        ...duplicateProjectIds,
        [newItemId]: duplicateFromId
      }
    }));
  }

  return useCase;
}

export type DuplicateProjectInProjectManagerUseCase = ReturnType<typeof createDuplicateProjectInProjectManagerUseCase>;
