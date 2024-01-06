/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createDragWorkflowFromWorkflowSwitcherUseCase({
  appStore,
}: Deps) {
  const useCase = (sourceProjectId: EntityId, workflowId: EntityId) => {
    let state = appStore.get();
    const project = entityStateActions.projects.getOne(state, sourceProjectId);
    if (project) {
      if (project.workflowIds.indexOf(workflowId) > -1) {
        state = dragDropStateActions.resetOver(state);
        appStore.set({
          ...state,
          ui: {
            ...state.ui,
            dragDrop: {
              ...state.ui.dragDrop,
              from: {
                workflowSwitcher: {
                  projectId: sourceProjectId,
                  workflowId: workflowId
                }
              }
            }
          }
        })
      }
    }
  }

  return useCase;
}

export type DragWorkflowFromWorkflowSwitcherUseCase = ReturnType<typeof createDragWorkflowFromWorkflowSwitcherUseCase>;
