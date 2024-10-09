/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflow';
import { CloneWorkflowSubCase } from '@/application/useCases/workflow/subs/cloneWorkflow';
import { EntityId } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { addItemToList, findIndexOrUndef } from '@/base/list';
import { getAllWorkflowNamesFromWorkflowIdList } from '@/base/state/actions/usedNames';
import { generateCopyName } from '@/base/utils';
import { updateWorkflowSettings } from '@/base/workflow';

type Deps = {
  appStore: AppStore;
  cloneWorkflowSubCase: CloneWorkflowSubCase;
}
export function createPasteWorkflowUseCase({
  appStore,
  cloneWorkflowSubCase,
}: Deps) {
  const useCase = async (workflowCopyId: EntityId, posByWorkflowId?: EntityId) => {
    let state = appStore.get();
    const workflowCopyEntity = state.ui.copy.workflows.entities[workflowCopyId];
    if (!workflowCopyEntity) {
      return;
    }

    const { currentProjectId } = state.ui.projectSwitcher;
    const currentProject = state.entities.projects[currentProjectId];
    if (!currentProject) {
      return;
    }

    const { entity, deps } = workflowCopyEntity;

    const [workflowClone, newWidgets] = await cloneWorkflowSubCase(entity, deps);
    const newWorkflow = updateWorkflowSettings(workflowClone, {
      ...workflowClone.settings,
      name: generateCopyName(entity.settings.name, getAllWorkflowNamesFromWorkflowIdList(state.entities.workflows, currentProject.workflowIds))
    })
    const posIdx = findIndexOrUndef(currentProject.workflowIds, posByWorkflowId)

    state = {
      ...state,
      entities: {
        ...state.entities,
        workflows: addOneToEntityCollection(state.entities.workflows, newWorkflow),
        widgets: addManyToEntityCollection(state.entities.widgets, newWidgets),
        projects: updateOneInEntityCollection(state.entities.projects, {
          id: currentProject.id,
          changes: {
            workflowIds: addItemToList(currentProject.workflowIds, newWorkflow.id, posIdx)
          }
        }),
      }
    };

    state = setCurrentWorkflowSubCase(state, currentProject.id, newWorkflow.id, true);

    appStore.set(state);
  }

  return useCase;
}

export type PasteWorkflowUseCase = ReturnType<typeof createPasteWorkflowUseCase>;
