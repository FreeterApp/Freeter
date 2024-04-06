/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddAppInAppManagerUseCase } from '@/application/useCases/appManager/addAppInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureAppA, fixtureAppB, fixtureAppSettingsA, fixtureAppSettingsB } from '@tests/base/fixtures/app';
import { fixtureAppAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';

const newItemId = 'NEW-ITEM-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const addAppInAppManagerUseCase = createAddAppInAppManagerUseCase({
    appStore,
    idGenerator: () => newItemId
  });
  return {
    appStore,
    addAppInAppManagerUseCase
  }
}

describe('addAppInAppManagerUseCase()', () => {
  it('should do nothing, if apps is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: null,
              appIds: ['SOME-ID']
            })
          })
        })
      }
    })
    const {
      appStore,
      addAppInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    addAppInAppManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if appIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: fixtureAppAInColl(),
              appIds: null
            })
          })
        })
      }
    })
    const {
      appStore,
      addAppInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    addAppInAppManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should add a new app with a right name as a last item and make it a current app in the app manager state, and return the id of the new item', async () => {
    const appA = fixtureAppA({ settings: fixtureAppSettingsA({ name: 'App 1' }) });
    const appB = fixtureAppB({ settings: fixtureAppSettingsB({ name: 'App 2' }) });
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: {
                [appA.id]: appA,
                [appB.id]: appB
              },
              currentAppId: appA.id,
              appIds: [appB.id, appA.id]
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
                [newItemId]: expect.objectContaining({
                  id: newItemId,
                  settings: expect.objectContaining({
                    name: 'App 3',
                  })
                })
              },
              currentAppId: newItemId,
              appIds: [appB.id, appA.id, newItemId]
            }
          }
        }
      }
    }
    const {
      appStore,
      addAppInAppManagerUseCase
    } = await setup(initState)

    const res = addAppInAppManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
    expect(res).toBe(newItemId);
  })
})
