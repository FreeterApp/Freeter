/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDuplicateAppInAppManagerUseCase } from '@/application/useCases/appManager/duplicateAppInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppA } from '@tests/base/fixtures/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const appId = 'APP-ID';
const newItemId = 'NEW-ITEM-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const mockIdGenerator = jest.fn(() => newItemId);
  const duplicateAppInAppManagerUseCase = createDuplicateAppInAppManagerUseCase({
    appStore,
    idGenerator: mockIdGenerator
  });
  return {
    appStore,
    duplicateAppInAppManagerUseCase,
    mockIdGenerator
  }
}

describe('duplicateAppInAppManagerUseCase()', () => {
  it('should do nothing, if apps is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              apps: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateAppInAppManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateAppInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if appIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              appIds: null,
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateAppInAppManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateAppInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if specified app does not exist', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              appIds: [appId],
              apps: {
                [appId]: fixtureAppA({ id: appId })
              },
            })
          })
        })
      }
    })
    const {
      appStore,
      duplicateAppInAppManagerUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    duplicateAppInAppManagerUseCase('NO-SUCH-ID');

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should correctly update the state', async () => {
    const newAppId = 'NEW-APP-ID';
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              appIds: [appId],
              apps: {
                [appId]: fixtureAppA({ id: appId })
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
              appIds: [appId, newAppId],
              apps: {
                ...initState.ui.modalScreens.data.appManager.apps,
                [newAppId]: expect.objectContaining({
                  id: newAppId,
                  settings: expect.objectContaining({
                    ...initState.ui.modalScreens.data.appManager.apps![appId]!.settings,
                    name: initState.ui.modalScreens.data.appManager.apps![appId]!.settings.name + ' Copy 1'
                  })
                })
              },
              currentAppId: newAppId
            }
          }
        }
      }
    }
    const {
      appStore,
      duplicateAppInAppManagerUseCase,
      mockIdGenerator
    } = await setup(initState)
    mockIdGenerator.mockImplementationOnce(() => newAppId);

    duplicateAppInAppManagerUseCase(appId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
