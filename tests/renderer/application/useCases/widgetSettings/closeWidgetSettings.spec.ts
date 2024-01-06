/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/closeWidgetSettings';
import { AppState } from '@/base/state/app';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
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
  it('should remove widgetInEnv from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        widgetSettings: fixtureWidgetSettings({
          widgetInEnv: {
            widget: fixtureWidgetA(),
            env: fixtureWidgetEnvAreaShelf(),
          }
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        widgetSettings: {
          ...initState.ui.widgetSettings,
          widgetInEnv: null
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
