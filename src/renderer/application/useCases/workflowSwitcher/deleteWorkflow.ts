/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { deleteWorkflowsFromAppState } from '@/base/state/actions';

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
          appStore.set(deleteWorkflowsFromAppState(state, currentProjectId, [workflowId]));
        }
      }
    }
  }

  return useCase;
}

export type DeleteWorkflowUseCase = ReturnType<typeof createDeleteWorkflowUseCase>;
