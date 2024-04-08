/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateAppSettingsInAppManagerUseCase } from '@/application/useCases/appManager/updateAppSettingsInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppA, fixtureAppB, fixtureAppSettingsA, fixtureAppSettingsB } from '@tests/base/fixtures/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateAppSettingsInAppManagerUseCase = createUpdateAppSettingsInAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    updateAppSettingsInAppManagerUseCase
  }
}

describe('updateAppSettingsInAppManagerUseCase()', () => {
  it('should do nothing, if apps is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateAppSettingsInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    updateAppSettingsInAppManagerUseCase('SOME-ID', fixtureAppSettingsA());

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the settings of a right app in App Manager state', async () => {
    const app = fixtureAppA({
      settings: fixtureAppSettingsA({
        name: 'Name A'
      }),
    });
    const appB = fixtureAppB();
    const appWithNewSettings: typeof app = {
      ...app,
      settings: fixtureAppSettingsB({
        name: 'Name B',
      }),
    }
    const initState = fixtureAppState({
      entities: {
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: {
                [app.id]: app,
                [appB.id]: appB
              }
            })
          })
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
            appManager: {
              ...initState.ui.modalScreens.data.appManager,
              apps: {
                ...initState.ui.modalScreens.data.appManager.apps,
                [app.id]: appWithNewSettings
              }
            }
          }
        }
      }
    }
    const {
      appStore,
      updateAppSettingsInAppManagerUseCase
    } = await setup(initState)

    updateAppSettingsInAppManagerUseCase(app.id, appWithNewSettings.settings);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
