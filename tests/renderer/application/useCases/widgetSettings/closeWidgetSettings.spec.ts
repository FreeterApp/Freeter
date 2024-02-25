/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/closeWidgetSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeWidgetSettingsUseCase = createCloseWidgetSettingsUseCase({
    appStore
  });
  return {
    appStore,
    closeWidgetSettingsUseCase
  }
}

describe('closeWidgetSettingsUseCase()', () => {
  it('should remove the screen from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            widgetSettings: fixtureWidgetSettings({
              widgetInEnv: {
                widget: fixtureWidgetA(),
                env: fixtureWidgetEnvAreaShelf(),
              }
            })
          }),
          order: ['about', 'widgetSettings']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            widgetSettings: {
              ...initState.ui.modalScreens.data.widgetSettings,
              widgetInEnv: null
            }
          },
          order: ['about']
        }
      }
    }
    const {
      appStore,
      closeWidgetSettingsUseCase
    } = await setup(initState)

    closeWidgetSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
