/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { ProjectSwitcherPos } from '@/base/state/ui';

type Deps = {
  appStore: AppStore;
}

export function createSetProjectSwitcherPositionUseCase({
  appStore
}: Deps) {
  const useCase = (newPos: ProjectSwitcherPos) => {
    const state = appStore.get();
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        projectSwitcher: {
          ...state.ui.projectSwitcher,
          pos: newPos
        }
      }
    })
  }

  return useCase;
}

export type SetProjectSwitcherPositionUseCase = ReturnType<typeof createSetProjectSwitcherPositionUseCase>;
