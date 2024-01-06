/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createGetWidgetSettingsApiUseCase } from '@/application/useCases/widgetSettings/getWidgetSettingsApi';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);

  const getWidgetSettingsApiUseCase = createGetWidgetSettingsApiUseCase({
    appStore
  });
  return {
    appStore,

    getWidgetSettingsApiUseCase
  }
}

describe('getWidgetSettingsApiUseCase()', () => {
  describe('updateSettings', () => {
    it('should do nothing, if widgetInEnv is null', async () => {
      const newSettings = {
        newProp: 'NEW-VALUE'
      }
      const initState = fixtureAppState({
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: null
          })
        }
      })
      const {
        appStore,
        getWidgetSettingsApiUseCase
      } = await setup(initState)
      const expectState = appStore.get();
      const settingsApi = getWidgetSettingsApiUseCase();

      settingsApi.updateSettings(newSettings);

      expect(appStore.get()).toBe(expectState);
    })

    it('should update the settings state', async () => {
      const newSettings = {
        newProp: 'NEW-VALUE'
      }
      const widget = fixtureWidgetA()
      const initState = fixtureAppState({
        ui: {
          widgetSettings: fixtureWidgetSettings({
            widgetInEnv: {
              widget,
              env: fixtureWidgetEnvAreaShelf(),
            }
          })
        }
      })
      const expectState: typeof initState = {
        ...initState,
        ui: {
          ...initState.ui,
          widgetSettings: {
            ...initState.ui.widgetSettings,
            widgetInEnv: {
              ...initState.ui.widgetSettings.widgetInEnv!,
              widget: {
                ...widget,
                settings: {
                  ...widget.settings,
                  ...newSettings
                }
              }
            }
          }
        }
      }
      const {
        appStore,
        getWidgetSettingsApiUseCase
      } = await setup(initState)
      const settingsApi = getWidgetSettingsApiUseCase();

      settingsApi.updateSettings(newSettings);

      const newState = appStore.get();
      expect(newState).toEqual(expectState);
    })
  })
})
