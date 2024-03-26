/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { AppStore } from '@/application/interfaces/store';
import { deleteWorkflowsSubCase } from '@/application/useCases/workflow/subs/deleteWorkflows';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection, removeManyFromEntityCollection, setOneInEntityCollection } from '@/base/entityCollection';

type Deps = {
  appStore: AppStore;
  dialog: DialogProvider;
}
export function createDeleteWorkflowUseCase({
  appStore,
  dialog,
}: Deps) {
  const useCase = async (workflowId: EntityId) => {
    const state = appStore.get();
    const workflow = getOneFromEntityCollection(state.entities.workflows, workflowId);
    if (workflow) {
      const { currentProjectId } = state.ui.projectSwitcher;
      const currentProject = getOneFromEntityCollection(state.entities.projects, currentProjectId);
      if (currentProject) {
        const dialogRes = await dialog.showMessageBox({ message: `Are you sure you want to delete the "${workflow.settings.name}" workflow?`, buttons: ['Ok', 'Cancel'], cancelId: 1, defaultId: 1, type: 'warning' })
        if (dialogRes.response === 0) {
          const [updatedOwnerProject, deletedWorkflowIds, deletedWidgetIds] = deleteWorkflowsSubCase([workflow], currentProject)
          appStore.set({
            ...state,
            entities: {
              ...state.entities,
              projects: setOneInEntityCollection(state.entities.projects, updatedOwnerProject),
              widgets: removeManyFromEntityCollection(state.entities.widgets, deletedWidgetIds),
              workflows: removeManyFromEntityCollection(state.entities.workflows, deletedWorkflowIds)
            },
          });
        }
      }
    }
  }

  return useCase;
}

export type DeleteWorkflowUseCase = ReturnType<typeof createDeleteWorkflowUseCase>;
