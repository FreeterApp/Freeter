/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { modalScreensStateActions } from '@/base/state/actions';
import { WidgetCoreSettings } from '@/base/widget';

type Deps = {
  appStore: AppStore;
}

export function createUpdateWidgetCoreSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = (coreSettings: WidgetCoreSettings) => {
    const state = appStore.get();
    const { widgetInEnv } = state.ui.modalScreens.data.widgetSettings;
    if (!widgetInEnv) {
      return;
    }
    appStore.set(modalScreensStateActions.updateModalScreen(state, 'widgetSettings', {
      widgetInEnv: {
        ...widgetInEnv,
        widget: {
          ...widgetInEnv.widget,
          coreSettings: {
            ...widgetInEnv.widget.coreSettings,
            ...coreSettings
          }
        }
      }
    }));
  }

  return useCase;
}

export type UpdateWidgetCoreSettingsUseCase = ReturnType<typeof createUpdateWidgetCoreSettingsUseCase>;
