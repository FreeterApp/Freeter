/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createToggleDeletionInAppManagerUseCase } from '@/application/useCases/appManager/toggleDeletionInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const appId = 'APP-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const toggleDeletionInAppManagerUseCase = createToggleDeletionInAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    toggleDeletionInAppManagerUseCase
  }
}

describe('toggleDeletionInAppManagerUseCase()', () => {
  it('should do nothing, if deleteAppIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      toggleDeletionInAppManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    toggleDeletionInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set true for the specified app id, when the current value is undefined', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: { 'some-app': true },
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
              deleteAppIds: {
                ...initState.ui.modalScreens.data.appManager.deleteAppIds,
                [appId]: true
              },
            }
          }
        }
      }
    }
    const {
      appStore,
      toggleDeletionInAppManagerUseCase
    } = await setup(initState)

    toggleDeletionInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set true for the specified app id, when the current value is false', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {
                'some-app': true,
                [appId]: false
              },
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
              deleteAppIds: {
                ...initState.ui.modalScreens.data.appManager.deleteAppIds,
                [appId]: true
              },
            }
          }
        }
      }
    }
    const {
      appStore,
      toggleDeletionInAppManagerUseCase
    } = await setup(initState)

    toggleDeletionInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should set false for the specified app id, when the current value is true', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {
                'some-app': true,
                [appId]: true
              },
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
              deleteAppIds: {
                ...initState.ui.modalScreens.data.appManager.deleteAppIds,
                [appId]: false
              },
            }
          }
        }
      }
    }
    const {
      appStore,
      toggleDeletionInAppManagerUseCase
    } = await setup(initState)

    toggleDeletionInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
