/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSaveChangesInAppManagerUseCase } from '@/application/useCases/appManager/saveChangesInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureAppA, fixtureAppB, fixtureAppC, fixtureAppD, fixtureAppSettingsA } from '@tests/base/fixtures/app';
import { fixtureAppAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureApps } from '@tests/base/state/fixtures/apps';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const saveChangesInAppManagerUseCase = createSaveChangesInAppManagerUseCase({
    appStore,
  });

  return {
    appStore,
    saveChangesInAppManagerUseCase,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('saveChangesInAppManagerUseCase()', () => {
  it('should do nothing, if apps is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: null,
              appIds: ['SOME-ID'],
              deleteAppIds: {},
            })
          }),
          order: ['about', 'appManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInAppManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if appIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: fixtureAppAInColl(),
              appIds: null,
              deleteAppIds: { 'SOME-ID': true },
            })
          }),
          order: ['about', 'appManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInAppManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if deleteAppIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: fixtureAppAInColl(),
              appIds: [],
              deleteAppIds: null,
            })
          }),
          order: ['about', 'appManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInAppManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the apps entities and the apps order, and reset the app manager data', async () => {
    const appA = fixtureAppA();
    const appB = fixtureAppB();
    const appC = fixtureAppC();

    const updAppA = fixtureAppA({
      settings: fixtureAppSettingsA({ name: 'New Name' })
    })
    const initState = fixtureAppState({
      entities: {
        apps: {
          [appA.id]: appA,
        }
      },
      ui: {
        apps: fixtureApps({
          appIds: [appA.id],
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: {
                [appA.id]: updAppA,
                [appB.id]: appB,
                [appC.id]: appC,
              },
              currentAppId: appA.id,
              appIds: [appB.id, appA.id, appC.id],
              deleteAppIds: {},
            })
          }),
          order: ['about', 'appManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        apps: {
          [appA.id]: updAppA,
          [appB.id]: appB,
          [appC.id]: appC
        },
      },
      ui: {
        ...initState.ui,
        apps: {
          ...initState.ui.apps,
          appIds: [appB.id, appA.id, appC.id],
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            appManager: {
              currentAppId: '',
              deleteAppIds: null,
              appIds: null,
              apps: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      saveChangesInAppManagerUseCase
    } = await setup(initState)

    await saveChangesInAppManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  });

  it('should delete apps from the state after applying app and app order changes and resetting the app manager state, when there are marked apps', async () => {
    const appA = fixtureAppA();
    const appB = fixtureAppB();
    const appC = fixtureAppC();
    const appD = fixtureAppD();
    const updAppA = fixtureAppA({
      settings: fixtureAppSettingsA({ name: 'New Name' })
    })
    const initState = fixtureAppState({
      entities: {
        apps: {
          [appA.id]: appA,
          [appB.id]: appB,
        }
      },
      ui: {
        apps: fixtureApps({
          appIds: [appA.id, appB.id],
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: {
                [appA.id]: updAppA,
                [appB.id]: appB,
                [appC.id]: appC,
                [appD.id]: appD,
              },
              currentAppId: appA.id,
              appIds: [appB.id, appC.id, appA.id, appD.id],
              deleteAppIds: {
                [appB.id]: true,
                [appC.id]: true,
                [appD.id]: false,
              },
            })
          }),
          order: ['about', 'appManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        apps: {
          [appA.id]: {
            ...initState.ui.modalScreens.data.appManager.apps![appA.id]!,
          },
          [appD.id]: {
            ...initState.ui.modalScreens.data.appManager.apps![appD.id]!,
          }
        },
      },
      ui: {
        ...initState.ui,
        apps: {
          ...initState.ui.apps,
          appIds: [appA.id, appD.id],
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            appManager: {
              currentAppId: '',
              deleteAppIds: null,
              appIds: null,
              apps: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      saveChangesInAppManagerUseCase
    } = await setup(initState)

    await saveChangesInAppManagerUseCase();

    expect(appStore.get()).toEqual(expectState);
  });

})
