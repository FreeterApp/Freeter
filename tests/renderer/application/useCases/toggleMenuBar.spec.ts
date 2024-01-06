/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createToggleMenuBarUseCase } from '@/application/useCases/toggleMenuBar';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const toggleMenuBarUseCase = createToggleMenuBarUseCase({
    appStore
  });
  return {
    appStore,
    toggleMenuBarUseCase
  }
}

describe('toggleMenuBarUseCase()', () => {
  it('should toggle menuBar state', async () => {
    const initState = fixtureAppState({
      ui: {
        menuBar: false
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        menuBar: true
      }
    }
    const {
      appStore,
      toggleMenuBarUseCase
    } = await setup(initState)

    toggleMenuBarUseCase();

    expect(appStore.get()).toEqual(expectState);

    toggleMenuBarUseCase();

    expect(appStore.get()).toEqual(initState);
  })
})
