/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';

type Deps = {
  appStore: AppStore;
}

export function createToggleEditModeUseCase({
  appStore
}: Deps) {
  const useCase = () => {
    const state = appStore.get();
    const { editMode } = state.ui;
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        editMode: !editMode
      }
    })
  }

  return useCase;
}

export type ToggleEditModeUseCase = ReturnType<typeof createToggleEditModeUseCase>;
