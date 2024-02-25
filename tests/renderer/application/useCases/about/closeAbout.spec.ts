/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseAboutUseCase } from '@/application/useCases/about/closeAbout';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeAboutUseCase = createCloseAboutUseCase({
    appStore
  });
  return {
    appStore,
    closeAboutUseCase
  }
}

describe('closeAboutUseCase()', () => {
  it('should remove about from the modal screens state', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData(),
          order: ['applicationSettings', 'about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          order: ['applicationSettings', 'projectManager']
        }
      }
    }
    const {
      appStore,
      closeAboutUseCase
    } = await setup(initState)

    closeAboutUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
