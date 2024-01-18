/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WindowState, prepareWindowState, mergeWindowStateWithPersistentWindowState } from '@/base/state/window';
import { createWindowStore } from '@/data/windowStore';
import { createStore } from '@common/data/store';
import { StateStorage } from '@common/data/stateStorage';

jest.mock('@common/data/store');
const mockedCreateStore = jest.mocked(createStore);

beforeEach(() => {
  jest.resetAllMocks()
})

describe('WindowStore', () => {
  describe('createWindowStore', () => {
    it('should call createStore with right params and return its value', async () => {
      const deps = { 'deps': 'deps' } as unknown as { stateStorage: StateStorage<WindowState, WindowState>; };
      const initialState = { 'init': 'state' } as unknown as WindowState;
      const onReady = { 'onReady': 'function' } as unknown as () => undefined;
      const retVal = 'value' as unknown as ReturnType<typeof createStore<object, object>>;

      mockedCreateStore.mockImplementation(() => retVal);

      const gotVal = createWindowStore(deps, initialState, onReady);
      expect(mockedCreateStore).toBeCalledTimes(1);
      expect(mockedCreateStore).toBeCalledWith(deps, initialState, prepareWindowState, mergeWindowStateWithPersistentWindowState, onReady);
      expect(gotVal).toBe(retVal);
    })
  })
})
