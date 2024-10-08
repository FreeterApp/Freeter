/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { CreateWorkflowSubCase } from '@/application/useCases/workflow/subs/createWorkflow';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection, setOneInEntityCollection } from '@/base/entityCollection';
import { addItemToList, findIndexOrUndef } from '@/base/list';
import { getAllWorkflowNamesFromWorkflowIdList } from '@/base/state/actions/usedNames';
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
    const newWorkflow = createWorkflowSubCase(generateWorkflowName(getAllWorkflowNamesFromWorkflowIdList(state.entities.workflows, currentProject.workflowIds)))

    const [updPrj] = setCurrentWorkflowSubCase(currentProject, newWorkflow.id);

    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        projects: setOneInEntityCollection(state.entities.projects, {
          ...updPrj,
          workflowIds: addItemToList(currentProject.workflowIds, newWorkflow.id, findIndexOrUndef(currentProject.workflowIds, posByWorkflowId))
        }),
        workflows: addOneToEntityCollection(state.entities.workflows, newWorkflow)
      },
    })

    return newWorkflow.id;
  }

  return useCase;
}

export type AddWorkflowUseCase = ReturnType<typeof createAddWorkflowUseCase>;
