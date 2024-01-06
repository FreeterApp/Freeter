/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseAboutUseCase } from '@/application/useCases/about/closeAbout';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
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
  it('should set about=false to the app state', async () => {
    const initState = fixtureAppState({
      ui: {
        about: true
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        about: false
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
