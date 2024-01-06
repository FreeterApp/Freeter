/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSaveApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/saveApplicationSettings';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const saveApplicationSettingsUseCase = createSaveApplicationSettingsUseCase({
    appStore
  });
  return {
    appStore,
    saveApplicationSettingsUseCase
  }
}

describe('saveApplicationSettingsUseCase()', () => {
  it('should do nothing, if appConfig in application settings is null', async () => {
    const initState = fixtureAppState({
      ui: {
        applicationSettings: fixtureApplicationSettings({
          appConfig: null
        })
      }
    })
    const {
      appStore,
      saveApplicationSettingsUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    saveApplicationSettingsUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should save the appConfig from Application Settings to UI state and set appConfig=null in Application Settings state', async () => {
    const appConfig = fixtureAppConfig({
      mainHotkey: 'Accelerator'
    });
    const newAppConfig: typeof appConfig = {
      ...appConfig,
      mainHotkey: 'NewAccelerator'
    }
    const initState = fixtureAppState({
      ui: {
        appConfig,
        applicationSettings: fixtureApplicationSettings({
          appConfig: newAppConfig,
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        appConfig: newAppConfig,
        applicationSettings: {
          ...initState.ui.applicationSettings,
          appConfig: null
        }
      }
    }
    const {
      appStore,
      saveApplicationSettingsUseCase
    } = await setup(initState)

    saveApplicationSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
