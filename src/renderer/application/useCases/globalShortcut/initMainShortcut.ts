/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { GlobalShortcutProvider } from '@/application/interfaces/globalShortcutProvider';

type Deps = {
  appStore: AppStore;
  globalShortcut: GlobalShortcutProvider;
}

export function createInitMainShortcutUseCase({
  appStore,
  globalShortcut,
}: Deps) {
  const initMainShortcutUseCase = () => {
    appStore.subscribe(state => ({
      isLoading: state.isLoading,
      mainHotkey: state.ui.appConfig.mainHotkey,
    }), ({
      isLoading,
      mainHotkey,
    }) => {
      if (!isLoading) {
        globalShortcut.setMainShortcut(mainHotkey)
      }
    }, { fireImmediately: true });
  }

  return initMainShortcutUseCase;
}

export type InitMainShortcutUseCase = ReturnType<typeof createInitMainShortcutUseCase>;
