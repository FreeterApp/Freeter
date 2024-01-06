/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSetWindowStateUseCase } from '@/application/useCases/browserWindow/setWindowState';
import { WindowState } from '@/base/state/window';
import { fixtureWindowState } from '@tests/base/state/fixtures/windowState';
import { fixtureWindowStore } from '@tests/data/fixtures/windowStore';

async function setup(initState: WindowState) {
  const [windowStore] = await fixtureWindowStore(initState);
  const setWindowStateUseCase = createSetWindowStateUseCase({
    windowStore
  });
  return {
    windowStore,
    setWindowStateUseCase
  }
}

describe('setWindowStateUseCase()', () => {
  it('should update window state', async () => {
    const initState = fixtureWindowState({ w: 20, isFull: true });
    const newState = fixtureWindowState({ w: 30, isFull: false });
    const {
      windowStore,
      setWindowStateUseCase
    } = await setup(initState)

    setWindowStateUseCase(newState);

    expect(windowStore.get()).toEqual(newState);
  })
})
