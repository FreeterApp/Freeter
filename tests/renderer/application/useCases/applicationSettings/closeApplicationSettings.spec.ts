/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/closeApplicationSettings';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
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
  it('should remove the screen from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: fixtureAppConfig()
            })
          }),
          order: ['about', 'applicationSettings']
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
            applicationSettings: {
              ...initState.ui.modalScreens.data.applicationSettings,
              appConfig: null
            }
          },
          order: ['about']
        },
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
