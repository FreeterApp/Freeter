/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState, initAppStateWidgets, mergeAppStateWithPersistentAppState } from '@/base/state/app';
import { createAppStore } from '@/data/appStore';
import { createStore } from '@common/data/store';
import { StateStorage } from '@common/data/stateStorage';

jest.mock('@common/data/store');
const mockedCreateStore = jest.mocked(createStore);

beforeEach(() => {
  jest.resetAllMocks()
})

describe('AppStore', () => {
  describe('createAppStore', () => {
    it('should call createStore with right params and return its value', async () => {
      const deps = { 'deps': 'deps' } as unknown as { stateStorage: StateStorage<AppState, AppState>; };
      const initialState = { 'init': 'state' } as unknown as AppState;
      const onReady = { 'onReady': 'function' } as unknown as () => undefined;
      const retVal = 'value' as unknown as ReturnType<typeof createStore<object, object>>;

      mockedCreateStore.mockImplementation(() => retVal);

      const gotVal = createAppStore(deps, initialState, onReady);
      expect(mockedCreateStore).toBeCalledTimes(1);
      expect(mockedCreateStore).toBeCalledWith(deps, initialState, initAppStateWidgets, mergeAppStateWithPersistentAppState, onReady);
      expect(gotVal).toBe(retVal);
    })
  })
})
