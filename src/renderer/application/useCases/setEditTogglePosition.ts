/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EditTogglePos } from '@/base/state/ui';

type Deps = {
  appStore: AppStore;
}

export function createSetEditTogglePositionUseCase({
  appStore
}: Deps) {
  const useCase = (newPos: EditTogglePos) => {
    const state = appStore.get();
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editTogglePos: newPos
      }
    })
  }

  return useCase;
}

export type SetEditTogglePositionUseCase = ReturnType<typeof createSetEditTogglePositionUseCase>;
