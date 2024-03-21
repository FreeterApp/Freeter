/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { CloneWorkflowSubCase } from '@/application/useCases/workflow/cloneWorkflowSubCase';
import { EntityId } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { addItemToList, findIndexOrUndef } from '@/base/list';
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
    const state = appStore.get();
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
      name: generateCopyName(entity.settings.name, mapIdListToEntityList(state.entities.workflows, currentProject.workflowIds).map(item => item?.settings.name || ''))
    })
    const posIdx = findIndexOrUndef(currentProject.workflowIds, posByWorkflowId)
    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        workflows: addOneToEntityCollection(state.entities.workflows, newWorkflow),
        widgets: addManyToEntityCollection(state.entities.widgets, newWidgets),
        projects: updateOneInEntityCollection(state.entities.projects, {
          id: currentProjectId,
          changes: {
            currentWorkflowId: newWorkflow.id,
            workflowIds: addItemToList(currentProject.workflowIds, newWorkflow.id, posIdx)
          }
        }),

      }
    });
  }

  return useCase;
}

export type PasteWorkflowUseCase = ReturnType<typeof createPasteWorkflowUseCase>;
