/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/openApplicationSettings';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openApplicationSettingsUseCase = createOpenApplicationSettingsUseCase({
    appStore
  });
  return {
    appStore,
    openApplicationSettingsUseCase
  }
}

describe('openApplicationSettingsUseCase()', () => {
  it('should set appConfig to the application settings and add the screen to the order list, when it is not open', async () => {
    const appConfig = fixtureAppConfig({ mainHotkey: 'Accelerator' });
    const initState = fixtureAppState({
      ui: {
        appConfig,
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: null
            }),
          }),
          order: ['about']
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
              appConfig
            }
          },
          order: ['about', 'applicationSettings']
        }
      }
    }
    const {
      appStore,
      openApplicationSettingsUseCase
    } = await setup(initState)

    openApplicationSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set appConfig to the application settings and move the screen to the end of the order list, when it is open', async () => {
    const appConfig = fixtureAppConfig({ mainHotkey: 'Accelerator' });
    const initState = fixtureAppState({
      ui: {
        appConfig,
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: null
            }),
          }),
          order: ['applicationSettings', 'about']
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
              appConfig
            }
          },
          order: ['about', 'applicationSettings']
        }
      }
    }
    const {
      appStore,
      openApplicationSettingsUseCase
    } = await setup(initState)

    openApplicationSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
