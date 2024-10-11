/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';

type Deps = {
  appStore: AppStore;
}

export function createRenameWorkflowUseCase({
  appStore,
}: Deps) {
  const useCase = (workflowId: EntityId, newName: string) => {
    const state = appStore.get();
    const workflow = getOneFromEntityCollection(state.entities.workflows, workflowId);
    if (!workflow) {
      return;
    }
    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        workflows: updateOneInEntityCollection(state.entities.workflows, {
          id: workflowId,
          changes: {
            settings: {
              ...workflow.settings,
              name: newName
            }
          }
        })
      }
    });
  }

  return useCase;
}

export type RenameWorkflowUseCase = ReturnType<typeof createRenameWorkflowUseCase>;
