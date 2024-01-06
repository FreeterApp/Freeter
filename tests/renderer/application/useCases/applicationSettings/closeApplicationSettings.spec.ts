/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/closeApplicationSettings';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeApplicationSettingsUseCase = createCloseApplicationSettingsUseCase({
    appStore
  });
  return {
    appStore,
    closeApplicationSettingsUseCase
  }
}

describe('closeApplicationSettingsUseCase()', () => {
  it('should remove appConfig from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        applicationSettings: fixtureApplicationSettings({
          appConfig: fixtureAppConfig()
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        applicationSettings: {
          ...initState.ui.applicationSettings,
          appConfig: null
        }
      }
    }
    const {
      appStore,
      closeApplicationSettingsUseCase
    } = await setup(initState)

    closeApplicationSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
