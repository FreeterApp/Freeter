/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenAboutUseCase } from '@/application/useCases/about/openAbout';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openAboutUseCase = createOpenAboutUseCase({
    appStore
  });
  return {
    appStore,
    openAboutUseCase
  }
}

describe('openAboutUseCase()', () => {
  it('should open about screen in the app state, when it is not open', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          order: ['applicationSettings']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          order: ['applicationSettings', 'about']
        }
      }
    }
    const {
      appStore,
      openAboutUseCase
    } = await setup(initState)

    openAboutUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should move the about screen to the end of the order in the app state, when it is open', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          order: ['about', 'applicationSettings']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          order: ['applicationSettings', 'about']
        }
      }
    }
    const {
      appStore,
      openAboutUseCase
    } = await setup(initState)

    openAboutUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
