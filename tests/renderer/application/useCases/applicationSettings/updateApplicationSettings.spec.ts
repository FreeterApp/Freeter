/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/updateApplicationSettings';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateApplicationSettingsUseCase = createUpdateApplicationSettingsUseCase({
    appStore
  });
  return {
    appStore,
    updateApplicationSettingsUseCase
  }
}

describe('updateApplicationSettingsUseCase()', () => {
  it('should do nothing, if appConfig in Application Settings is null', async () => {
    const newAppConfig = fixtureAppConfig();
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateApplicationSettingsUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    updateApplicationSettingsUseCase(newAppConfig);

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the appConfig in Application Settings state', async () => {
    const appConfig = fixtureAppConfig({
      mainHotkey: 'Accelerator'
    });
    const newAppConfig = fixtureAppConfig({
      mainHotkey: 'NewAccelerator'
    });
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            applicationSettings: fixtureApplicationSettings({
              appConfig
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
            applicationSettings: {
              ...initState.ui.modalScreens.data.applicationSettings,
              appConfig: newAppConfig
            }
          }
        }
      }
    }
    const {
      appStore,
      updateApplicationSettingsUseCase
    } = await setup(initState)

    updateApplicationSettingsUseCase(newAppConfig);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
