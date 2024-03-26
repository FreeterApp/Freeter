/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, removeManyFromEntityCollection } from '@/base/entityCollection';
import { addOrMoveItemInList, limitListLength } from '@/base/list';
import { getWorkflowEntityDeps } from '@/base/state/entities';

type Deps = {
  appStore: AppStore;
}
export function createCopyWorkflowUseCase({
  appStore,
}: Deps) {
  const useCase = (workflowId: EntityId) => {
    let state = appStore.get();
    const { workflows } = state.entities;
    const workflow = workflows[workflowId];
    if (!workflow) {
      return;
    }
    const workflowDeps = getWorkflowEntityDeps(workflow, state.entities);
    const [list, deletedIds] = limitListLength(addOrMoveItemInList(state.ui.copy.workflows.list, workflow.id), 10);
    if (deletedIds.length > 0) {
      state = {
        ...state,
        ui: {
          ...state.ui,
          copy: {
            ...state.ui.copy,
            workflows: {
              ...state.ui.copy.workflows,
              entities: removeManyFromEntityCollection(state.ui.copy.workflows.entities, deletedIds)
            }
          }
        }
      }
    }

    state = {
      ...state,
      ui: {
        ...state.ui,
        copy: {
          ...state.ui.copy,
          workflows: {
            entities: addOneToEntityCollection(state.ui.copy.workflows.entities, {
              id: workflow.id,
              deps: workflowDeps,
              entity: workflow
            }),
            list
          }
        }
      }
    }
    appStore.set(state);
  }

  return useCase;
}

export type CopyWorkflowUseCase = ReturnType<typeof createCopyWorkflowUseCase>;
