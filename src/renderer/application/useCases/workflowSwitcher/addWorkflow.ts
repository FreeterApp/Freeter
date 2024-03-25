/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { CreateWorkflowSubCase } from '@/application/useCases/workflow/subs/createWorkflow';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { addItemToList, findIndexOrUndef } from '@/base/list';
import { generateWorkflowName } from '@/base/workflow';

type Deps = {
  appStore: AppStore;
  createWorkflowSubCase: CreateWorkflowSubCase;
}
export function createAddWorkflowUseCase({
  appStore,
  createWorkflowSubCase
}: Deps) {
  const useCase = (posByWorkflowId?: EntityId) => {
    const state = appStore.get();
    const { currentProjectId } = state.ui.projectSwitcher;
    const currentProject = getOneFromEntityCollection(state.entities.projects, currentProjectId);
    if (!currentProject) {
      return undefined;
    }
    const newWorkflow = createWorkflowSubCase(generateWorkflowName(mapIdListToEntityList(state.entities.workflows, currentProject.workflowIds).map(item => item?.settings.name || '')))

    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        projects: updateOneInEntityCollection(state.entities.projects, {
          id: currentProjectId,
          changes: {
            currentWorkflowId: newWorkflow.id,
            workflowIds: addItemToList(currentProject.workflowIds, newWorkflow.id, findIndexOrUndef(currentProject.workflowIds, posByWorkflowId))
          }
        }),
        workflows: addOneToEntityCollection(state.entities.workflows, newWorkflow)
      },
    })

    return newWorkflow.id;
  }

  return useCase;
}

export type AddWorkflowUseCase = ReturnType<typeof createAddWorkflowUseCase>;
