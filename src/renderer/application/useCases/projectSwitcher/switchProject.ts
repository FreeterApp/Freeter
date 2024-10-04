/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { setCurrentProjectSubCase } from '@/application/useCases/projectSwitcher/subs/setCurrentProjectSubCase';
import { EntityId } from '@/base/entity';

type Deps = {
  appStore: AppStore;
}
export function createSwitchProjectUseCase({
  appStore
}: Deps) {
  const useCase = (projectId: EntityId) => {
    const state = appStore.get();
    const [updPrjSwitcher] = setCurrentProjectSubCase(state.ui.projectSwitcher, projectId);
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectSwitcher: updPrjSwitcher
      }
    })
  }

  return useCase;
}

export type SwitchProjectUseCase = ReturnType<typeof createSwitchProjectUseCase>;
