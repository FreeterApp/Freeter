/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createToggleEditModeUseCase } from '@/application/useCases/toggleEditMode';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const toggleEditModeUseCase = createToggleEditModeUseCase({
    appStore
  });
  return {
    appStore,
    toggleEditModeUseCase
  }
}

describe('toggleEditModeUseCase()', () => {
  it('should toggle editMode state', async () => {
    const initState = fixtureAppState({
      ui: {
        editMode: false
      }
    });
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        editMode: true
      }
    }
    const {
      appStore,
      toggleEditModeUseCase
    } = await setup(initState)

    toggleEditModeUseCase();

    expect(appStore.get()).toEqual(expectState);

    toggleEditModeUseCase();

    expect(appStore.get()).toEqual(initState);
  })
})
