/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { deactivateWorkflowSubCase } from '@/application/useCases/memSaver/subs/deactivateWorkflow';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
}

export function createDeactivateWorkflowUseCase({
  appStore
}: Deps) {
  const useCase = (workflowId: EntityId) => {
    const appState = appStore.get();

    const newMemSaverState = deactivateWorkflowSubCase(workflowId, appState.ui.memSaver);

    if (newMemSaverState !== appState.ui.memSaver) {
      appStore.set({
        ...appState,
        ui: {
          ...appState.ui,
          memSaver: newMemSaverState
        }
      });
    }
  }

  return useCase;
}

export type DeactivateWorkflowUseCase = ReturnType<typeof createDeactivateWorkflowUseCase>;
