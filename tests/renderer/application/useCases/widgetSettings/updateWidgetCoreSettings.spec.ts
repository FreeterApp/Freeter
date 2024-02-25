/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateWidgetCoreSettingsUseCase } from '@/application/useCases/widgetSettings/updateWidgetCoreSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetCoreSettingsA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateWidgetCoreSettingsUseCase = createUpdateWidgetCoreSettingsUseCase({
    appStore
  });
  return {
    appStore,
    updateWidgetCoreSettingsUseCase
  }
}

describe('updateWidgetCoreSettingsUseCase()', () => {
  it('should do nothing, if widgetInEnv is null', async () => {
    const newSettings = fixtureWidgetCoreSettingsA();
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateWidgetCoreSettingsUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    updateWidgetCoreSettingsUseCase(newSettings);

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the coreSettings state', async () => {
    const newSettings = fixtureWidgetCoreSettingsA({
      name: 'New Name'
    });
    const widget = fixtureWidgetA()
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: {
                widget,
                env: fixtureWidgetEnvAreaShelf(),
              }
            })
          })
        })
      }
    })
    const expectState: typeof initState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            widgetSettings: {
              ...initState.ui.modalScreens.data.widgetSettings,
              widgetInEnv: {
                ...initState.ui.modalScreens.data.widgetSettings.widgetInEnv!,
                widget: {
                  ...widget,
                  coreSettings: {
                    ...widget.coreSettings,
                    ...newSettings
                  }
                }
              }
            }
          }
        }
      }
    }
    const {
      appStore,
      updateWidgetCoreSettingsUseCase
    } = await setup(initState)

    updateWidgetCoreSettingsUseCase(newSettings);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
