/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSwitchAppInAppManagerUseCase } from '@/application/useCases/appManager/switchAppInAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const switchAppInAppManagerUseCase = createSwitchAppInAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    switchAppInAppManagerUseCase
  }
}

describe('switchAppInAppManagerUseCase()', () => {
  it('should update current app id state', async () => {
    const testId = 'TEST-ID';
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              currentAppId: 'SOME-ID'
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
              currentAppId: testId
            }
          }
        }
      }
    }
    const {
      appStore,
      switchAppInAppManagerUseCase
    } = await setup(initState)

    switchAppInAppManagerUseCase(testId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
