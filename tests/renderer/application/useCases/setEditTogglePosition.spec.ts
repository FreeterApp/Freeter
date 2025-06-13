/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSetEditTogglePositionUseCase } from '@/application/useCases/setEditTogglePosition';
import { AppState } from '@/base/state/app';
import { EditTogglePos } from '@/base/state/ui';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const setEditTogglePosition = createSetEditTogglePositionUseCase({
    appStore
  });
  return {
    appStore,
    setEditTogglePosition
  }
}

describe('setEditTogglePositionUseCase()', () => {
  it('should set new pos state', async () => {
    const initState = fixtureAppState({
      ui: {
        editTogglePos: EditTogglePos.TabBarRight
      }
    });
    const newPos = EditTogglePos.TopBar
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        editTogglePos: newPos
      }
    }
    const {
      appStore,
      setEditTogglePosition
    } = await setup(initState)

    setEditTogglePosition(newPos);

    expect(appStore.get()).toEqual(expectState);
  })
})
