/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { moveItemInList, removeItemFromList, addItemToList } from '@/base/list';
import { AppStore } from '@/application/interfaces/store';
import { dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createDropOnWorkflowSwitcherUseCase({
  appStore,
}: Deps) {
  const useCase = (targetProjectId: EntityId, overWorkflowId: EntityId | null) => {
    let state = appStore.get();
    const { from: draggingFrom } = state.ui.dragDrop;
    if (draggingFrom?.workflowSwitcher) {
      const { projectId: sourceProjectId, workflowId } = draggingFrom.workflowSwitcher;
      const [sourceProject, targetProject] = entityStateActions.projects.getMany(state, [sourceProjectId, targetProjectId]);

      if (sourceProject && targetProject) {
        if (sourceProject === targetProject) {
          const { workflowIds } = targetProject;
          const sourceIdx = workflowIds.indexOf(workflowId);
          const targetIdx = overWorkflowId ? workflowIds.indexOf(overWorkflowId) : undefined;
          if (sourceIdx !== -1 && targetIdx !== -1) {
            const newWorkflowIds = moveItemInList(workflowIds, sourceIdx, targetIdx);
            state = entityStateActions.projects.updateOne(state, {
              id: targetProjectId,
              changes: {
                workflowIds: newWorkflowIds
              }
            })
          }
        } else {
          const { workflowIds: sourceWorkflowIds } = sourceProject;
          const { workflowIds: targetWorkflowIds } = targetProject;

          const sourceIdx = sourceWorkflowIds.indexOf(workflowId);
          const targetIdx = overWorkflowId ? targetWorkflowIds.indexOf(overWorkflowId) : undefined;

          if (sourceIdx !== -1 && targetIdx !== -1) {
            state = entityStateActions.projects.updateMany(state, [
              {
                id: sourceProjectId,
                changes: {
                  workflowIds: removeItemFromList(sourceWorkflowIds, sourceIdx)
                }
              },
              {
                id: targetProjectId,
                changes: {
                  workflowIds: addItemToList(targetWorkflowIds, workflowId, targetIdx)
                }
              }
            ])
          }
        }
      }
    }
    state = dragDropStateActions.resetAll(state);
    appStore.set(state);
  }

  return useCase;
}

export type DropOnWorkflowSwitcherUseCase = ReturnType<typeof createDropOnWorkflowSwitcherUseCase>;
