/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetSettingsApi } from '@/base/widgetApi';
import { AppStore } from '@/application/interfaces/store';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { modalScreensStateActions } from '@/base/state/actions';
import { WidgetSettings } from '@/base/widget';

interface Deps {
  appStore: AppStore;
  dialogProvider: DialogProvider;
}

export function createGetWidgetSettingsApiUseCase({
  appStore,
  dialogProvider,
}: Deps) {
  function getWidgetSettingsApiUseCase() {
    const settingsApi: WidgetSettingsApi<WidgetSettings> = {
      updateSettings: (settings: WidgetSettings) => {
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
              settings: {
                ...widgetInEnv.widget.settings,
                ...settings
              }
            }
          }
        }));
      },
      dialog: {
        showOpenDirDialog: cfg => dialogProvider.showOpenDirDialog(cfg),
        showOpenFileDialog: cfg => dialogProvider.showOpenFileDialog(cfg),
      }
    }
    return settingsApi;
  }

  return getWidgetSettingsApiUseCase;
}

export type GetWidgetSettingsApiUseCase = ReturnType<typeof createGetWidgetSettingsApiUseCase>;
