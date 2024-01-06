/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createGetWindowStateUseCase } from '@/application/useCases/browserWindow/getWindowState';
import { WindowState } from '@/base/state/window';
import { fixtureWindowState } from '@tests/base/state/fixtures/windowState';
import { fixtureWindowStore } from '@tests/data/fixtures/windowStore';

async function setup(initState: WindowState) {
  const [windowStore] = await fixtureWindowStore(initState);
  const getWindowStateUseCase = createGetWindowStateUseCase({
    windowStore
  });
  return {
    windowStore,
    getWindowStateUseCase
  }
}

describe('getWindowStateUseCase()', () => {
  it('should return window state', async () => {
    const initState = fixtureWindowState({});
    const {
      getWindowStateUseCase
    } = await setup(initState)

    const gotState = getWindowStateUseCase();

    expect(gotState).toEqual(initState);
  })
})
