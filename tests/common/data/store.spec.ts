/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { StateInStore } from '@common/application/interfaces/store';
import { createStore } from '@common/data/store';
import { fixtureStateStorageWithInvalidData, fixtureStateStorageWithNoData, fixtureStateStorageWithValidData } from '@testscommon/data/fixtures/stateStorage';

describe('Store', () => {
  describe('createStore', () => {
    it('should create a store with an init state with isLoading=true, before loading data from StateStorage', () => {
      const initState = { state: 'init state' };
      const persState = { state: 'persistent state' };
      const [store] = createStore({
        stateStorage: fixtureStateStorageWithValidData(persState),
      }, initState, s => s, s => s);

      expect(store.get()).toEqual({
        ...initState,
        isLoading: true
      });
    })

    it('should call an onStoreReady callback, when the store is ready', done => {
      const initState = { state: 'init state' };
      createStore({
        stateStorage: fixtureStateStorageWithValidData({})
      }, initState, s => s, s => s, () => {
        done();
      });
    })

    it('should merge the state with the data loaded from StateStorage using the merge function, prepare the state for app use with the prepare function and remove isLoading', done => {
      const initState = { state: 'init state', notPersKey: 'not persistent value', propReqPrep: '' };
      const persState = { state: 'persistent state' };
      const prepProps = { propReqPrep: 'prop after prep' };
      const merge = jest.fn((s: typeof initState, ps: typeof persState) => ({ ...s, ...ps }));
      const prepare = jest.fn((s: typeof initState) => ({ ...s, ...prepProps }));
      const [store] = createStore({
        stateStorage: fixtureStateStorageWithValidData(persState),
      }, initState, prepare, merge, () => {
        try {
          expect(store.get()).toEqual({
            ...initState,
            ...persState,
            ...prepProps
          });
          expect(merge).toBeCalled();
          expect(prepare).toBeCalled();
          done();
        } catch (error) {
          done(error);
        }
      });
    })

    it('should keep init state, if StateStorage is empty', done => {
      const initState = { state: 'init state' };
      const [store] = createStore({
        stateStorage: fixtureStateStorageWithNoData(),
      }, initState, s => s, s => s, () => {
        try {
          expect(store.get()).toEqual(initState);
          done();
        } catch (error) {
          done(error);
        }
      });
    })

    it.skip('should keep init state, if StateStorage has invalid data', done => {
      const initState = { state: 'init state' };
      const [store] = createStore({
        stateStorage: fixtureStateStorageWithInvalidData({ 'invalid': 'data' })
      }, initState, s => s, s => s, () => {
        try {
          expect(store.get()).toEqual(initState);
          done();
        } catch (error) {
          done(error);
        }
      });
    })
  })
  describe('get', () => {
    it('should return current app state', done => {
      const testState = { state: 'test state' };

      const [store] = createStore({
        stateStorage: fixtureStateStorageWithNoData(),
      }, testState, s => s, s => s, () => {
        try {
          expect(store.get()).toEqual(testState);
          done();
        } catch (e) {
          done(e);
        }
      });
    })
  })

  describe('set', () => {
    it('should not update state, when Store is not ready', done => {
      const initState = { state: 'init state' }
      const [store] = createStore({
        stateStorage: fixtureStateStorageWithNoData(),
      }, initState, s => s, s => s, () => {
        try {
          expect(store.get()).toEqual(initState);
          done();
        } catch (e) {
          done(e);
        }
      });

      const newState = { state: 'new state' }
      store.set(newState);

      expect(store.get()).toEqual({
        ...initState,
        isLoading: true
      });
    })

    it('should update the state in the store, when Store is ready', done => {
      const initState = { state: 'init state' }
      const stateStorage = fixtureStateStorageWithNoData();
      stateStorage.saveState = jest.fn();
      const [store] = createStore({
        stateStorage,
      }, initState, s => s, s => s, () => {
        const newState = { state: 'new state' }
        store.set(newState);
        try {
          expect(store.get()).toEqual(newState);
          done();
        } catch (e) {
          done(e);
        }
      });
    })

    it('should not saveState in StateStorage, when Store is not ready', () => {
      const stateStorage = fixtureStateStorageWithNoData();
      stateStorage.saveState = jest.fn();
      const [store] = createStore({
        stateStorage
      }, {}, s => s, s => s)

      const newState = { state: 'new state' } as StateInStore<object>;
      store.set(newState);

      expect(stateStorage.saveState).not.toBeCalled();
    })

    it('should save AppState into StateStorage, when Store is ready', done => {
      const stateStorage = fixtureStateStorageWithNoData();
      stateStorage.saveState = jest.fn();
      const [store] = createStore({
        stateStorage: stateStorage
      }, {}, s => s, s => s, () => {
        const newState = { state: 'new state' } as StateInStore<object>;
        store.set(newState);

        try {
          expect(stateStorage.saveState).toBeCalledTimes(1);
          expect(stateStorage.saveState).toBeCalledWith(newState);
          done();
        } catch (e) {
          done(e);
        }
      })
    })
  })

  // it('should allow to subscribe to state changes', () => {
  //   const [stateObject1, stateObject2] = mockStateObjects();

  //   const subs1 = jest.fn();
  //   const subs2 = jest.fn();

  //   const [store] = createStore(stateObject1);
  //   store.subscribe(subs1);
  //   store.subscribe(subs2);

  //   store.set(stateObject2);

  //   expect(subs1.mock.calls.length).toBe(1);
  //   expect(subs1.mock.calls[0][0]).toEqual(stateObject2);
  //   expect(subs1.mock.calls[0][1]).toEqual(stateObject1);

  //   expect(subs2.mock.calls.length).toBe(1);
  //   expect(subs2.mock.calls[0][0]).toEqual(stateObject2);
  //   expect(subs2.mock.calls[0][1]).toEqual(stateObject1);
  // })

  // it('should allow to subscribe to selected state properties\' changes', () => {
  //   const [stateObject] = mockStateObjects();

  //   const subs1 = jest.fn();
  //   const subs2 = jest.fn();

  //   const [store] = createStore(stateObject);
  //   store.subscribeWithSelector(state => state.str, subs1);
  //   store.subscribeWithSelector(state => state.num, subs2);

  //   store.set({
  //     str: 'newtext'
  //   });

  //   expect(subs1.mock.calls.length).toBe(1);
  //   expect(subs1.mock.calls[0][0]).toBe('newtext');
  //   expect(subs1.mock.calls[0][1]).toBe(stateObject.str);
  //   expect(subs2.mock.calls.length).toBe(0);

  //   store.set({
  //     num: 9999
  //   });

  //   expect(subs1.mock.calls.length).toBe(1);
  //   expect(subs2.mock.calls.length).toBe(1);
  //   expect(subs2.mock.calls[0][0]).toBe(9999);
  //   expect(subs2.mock.calls[0][1]).toBe(stateObject.num);

  // })
})
