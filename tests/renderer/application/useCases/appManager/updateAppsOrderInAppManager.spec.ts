/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateAppsOrderInAppManagerUseCase } from '@/application/useCases/appManager/updateAppsOrderInAppManager';
import { EntityIdList } from '@/base/entityList';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateAppsOrderInAppManagerUseCase = createUpdateAppsOrderInAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    updateAppsOrderInAppManagerUseCase
  }
}

describe('updateAppsOrderInAppManagerUseCase()', () => {
  it('should do nothing, if appIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              appIds: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateAppsOrderInAppManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    updateAppsOrderInAppManagerUseCase(['SOME-ID']);

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the appIds', async () => {
    const newAppIds: EntityIdList = ['PRJ-ID-2', 'PRJ-ID-1']
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              appIds: ['PRJ-ID-1', 'PRJ-ID-2']
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
              appIds: newAppIds
            }
          }
        }
      }
    }
    const {
      appStore,
      updateAppsOrderInAppManagerUseCase
    } = await setup(initState)

    updateAppsOrderInAppManagerUseCase(newAppIds);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
