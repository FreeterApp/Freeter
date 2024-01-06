/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';

type Deps = {
  appStore: AppStore;
}

export function createCloseAboutUseCase({
  appStore
}: Deps) {
  const useCase = () => {
    const state = appStore.get();
    appStore.set({
      ...state,
      ui: {
        ...state.ui,
        about: false
      }
    });
  }

  return useCase;
}

export type CloseAboutUseCase = ReturnType<typeof createCloseAboutUseCase>;
