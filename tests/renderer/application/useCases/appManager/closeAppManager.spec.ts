/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseAppManagerUseCase } from '@/application/useCases/appManager/closeAppManager';
import { AppState } from '@/base/state/app';
import { fixtureAppA } from '@tests/base/fixtures/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeAppManagerUseCase = createCloseAppManagerUseCase({
    appStore
  });
  return {
    appStore,
    closeAppManagerUseCase
  }
}

describe('closeAppManagerUseCase()', () => {
  it('should remove the screen from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              currentAppId: 'SOME-ID',
              deleteAppIds: { 'SOME-ID': false },
              apps: { 'SOME-ID': fixtureAppA() },
              appIds: ['SOME-ID']
            })
          }),
          order: ['about', 'appManager']
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
              currentAppId: '',
              deleteAppIds: null,
              apps: null,
              appIds: null
            }
          },
          order: ['about']
        }
      }
    }
    const {
      appStore,
      closeAppManagerUseCase
    } = await setup(initState)

    closeAppManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
