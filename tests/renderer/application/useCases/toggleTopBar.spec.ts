/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createToggleTopBarUseCase } from '@/application/useCases/toggleTopBar';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const toggleTopBarUseCase = createToggleTopBarUseCase({
    appStore
  });
  return {
    appStore,
    toggleTopBarUseCase
  }
}

describe('toggleTopBarUseCase()', () => {
  it('should toggle topBar state', async () => {
    const initState = fixtureAppState({
      ui: {
        topBar: false
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        topBar: true
      }
    }
    const {
      appStore,
      toggleTopBarUseCase
    } = await setup(initState)

    toggleTopBarUseCase();

    expect(appStore.get()).toEqual(expectState);

    toggleTopBarUseCase();

    expect(appStore.get()).toEqual(initState);
  })
})
