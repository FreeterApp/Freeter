/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenAppManagerUseCase } from '@/application/useCases/appManager/openAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppA, fixtureAppB, fixtureAppC } from '@tests/base/fixtures/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureApps } from '@tests/base/state/fixtures/apps';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const appId1 = 'APP-ID-1';
const appId2 = 'APP-ID-2';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openAppManagerUseCase = createOpenAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    openAppManagerUseCase
  }
}

describe('openAppManagerUseCase()', () => {
  it('should init the deletion array state and set the apps to the App Manager state using the app list of the Apps state, and add to the order list state, when it is not open', async () => {
    const appA = fixtureAppA({ id: appId1 });
    const appB = fixtureAppB({ id: appId2 })
    const appC = fixtureAppC();
    const initState = fixtureAppState({
      entities: {
        apps: {
          [appA.id]: appA,
          [appB.id]: appB,
          [appC.id]: appC
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              currentAppId: '',
              deleteAppIds: null,
              apps: null,
            }),
          }),
          order: ['about']
        }),
        apps: fixtureApps({
          appIds: [appId2, appId1]
        }),
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
              currentAppId: '',
              deleteAppIds: {},
              apps: {
                [appA.id]: appA,
                [appB.id]: appB,
                [appC.id]: appC
              },
              appIds: [appId2, appId1]
            }
          },
          order: ['about', 'appManager']
        },
      }
    }
    const {
      appStore,
      openAppManagerUseCase
    } = await setup(initState)

    openAppManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should init the deletion array state and set the apps to the App Manager state using the app list of the Apps state, and move the screen to the end of the order list state, when it is open', async () => {
    const appA = fixtureAppA({ id: appId1 });
    const appB = fixtureAppB({ id: appId2 })
    const appC = fixtureAppC();
    const initState = fixtureAppState({
      entities: {
        apps: {
          [appA.id]: appA,
          [appB.id]: appB,
          [appC.id]: appC
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              currentAppId: '',
              deleteAppIds: null,
              apps: null
            }),
          }),
          order: ['appManager', 'about']
        }),
        apps: fixtureApps({
          appIds: [appId2, appId1]
        }),
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
              currentAppId: '',
              deleteAppIds: {},
              apps: {
                [appA.id]: appA,
                [appB.id]: appB,
                [appC.id]: appC
              },
              appIds: [appId2, appId1]
            }
          },
          order: ['about', 'appManager']
        },
      }
    }
    const {
      appStore,
      openAppManagerUseCase
    } = await setup(initState)

    openAppManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
