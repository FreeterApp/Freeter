/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createVersionedObject, MigrateVersionedObject, VersionedObject } from '@common/base/versionedObject'
import { createStateStorage } from '@common/data/stateStorage'
import { withJson } from '@common/infra/dataStorage/withJson';
import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage'

jest.useFakeTimers();

const stateKeyInDataStorage = 'state-key';

describe('StateStorage', () => {
  describe('loadState', () => {
    it('should return state from DataStorage as-is without calling the migrate function, when the stored version equals to the current one', async () => {
      const state = { state: 'test' };
      const migrate: MigrateVersionedObject<object, typeof state> = jest.fn(() => ({ state: 'migrate to state' }));
      const curVer = 1;
      const stateStorage = createStateStorage(
        withJson(createInMemoryDataStorage({
          [stateKeyInDataStorage]: JSON.stringify(createVersionedObject(state, curVer))
        })),
        stateKeyInDataStorage,
        curVer,
        5000,
        migrate,
        state => state
      )

      const gotState = await stateStorage.loadState();

      expect(gotState).toEqual(state);
      expect(migrate).not.toBeCalled();
    })

    it('should migrate the state from DataStorage to the current version with the migrate function, when the stored version is outdated', async () => {
      const state = { state: 'test' };
      const migrateToState = { state: 'migrate to state' }
      const migrate: MigrateVersionedObject<object, typeof state> = jest.fn(() => migrateToState);
      const stateVer = 1;
      const curVer = 2;
      const stateStorage = createStateStorage(
        withJson(createInMemoryDataStorage({
          [stateKeyInDataStorage]: JSON.stringify(createVersionedObject(state, stateVer))
        })),
        stateKeyInDataStorage,
        curVer,
        5000,
        migrate,
        state => state
      )

      const gotState = await stateStorage.loadState();

      expect(gotState).toEqual(migrateToState);
      expect(migrate).toBeCalled();
      expect(migrate).toBeCalledWith(state, 1);
    })

    it('should return null, when DataStorage does not have data with the specified state key', async () => {
      const curVer = 1;
      const stateStorage = createStateStorage(
        withJson(createInMemoryDataStorage({
          ['no-such-key']: JSON.stringify(createVersionedObject({ state: 'test' }, curVer))
        })),
        stateKeyInDataStorage,
        curVer,
        5000,
        state => state,
        state => state
      )

      const gotState = await stateStorage.loadState();

      expect(gotState).toBeNull();
    })

    it('should return null, when DataStorage has an invalid VersionedObject', async () => {
      const curVer = 1;
      const stateStorage = createStateStorage(
        withJson(createInMemoryDataStorage({
          [stateKeyInDataStorage]: JSON.stringify({})
        })),
        stateKeyInDataStorage,
        curVer,
        5000,
        state => state,
        state => state
      )

      const gotState = await stateStorage.loadState();

      expect(gotState).toBeNull();
    })

    // TODO
    // it('should return undefined, when DataStorage has an invalid AppState object', () => {
    // })
  })

  describe('saveState', () => {
    it('should immediately save the state if specified msecs cooldown = 0', async () => {
      const curVer = 1;
      const state = { state: 'test' };
      type State = typeof state;
      const dataStorage = withJson(createInMemoryDataStorage({
        [stateKeyInDataStorage]: JSON.stringify(createVersionedObject(state, curVer))
      }))
      const stateStorage = createStateStorage(dataStorage, stateKeyInDataStorage, curVer, 0, s => s, s => s);
      const newState = { state: 'new state' };

      stateStorage.saveState(newState);

      expect((await dataStorage.getJson(stateKeyInDataStorage) as VersionedObject<State>).obj).toEqual(newState);
    })

    it('should ignore multiple saves in a row, and only save a last state after specified msecs cooldown', async () => {
      const curVer = 1;
      const state = { state: 'test' };
      type State = typeof state;
      const dataStorage = withJson(createInMemoryDataStorage({
        [stateKeyInDataStorage]: JSON.stringify(createVersionedObject(state, curVer))
      }))
      const stateStorage = createStateStorage(dataStorage, stateKeyInDataStorage, curVer, 5000, s => s, s => s);
      const initState = await stateStorage.loadState();
      const newState1 = { state: 'new state 1' };
      const newState2 = { state: 'new state 2' };
      const newState3 = { state: 'new state 3' };

      stateStorage.saveState(newState1);
      jest.advanceTimersByTime(1000);

      expect((await dataStorage.getJson(stateKeyInDataStorage) as VersionedObject<State>).obj).toEqual(initState);

      stateStorage.saveState(newState2);
      jest.advanceTimersByTime(1000);

      expect((await dataStorage.getJson(stateKeyInDataStorage) as VersionedObject<State>).obj).toEqual(initState);

      stateStorage.saveState(newState3);
      jest.advanceTimersByTime(5000);

      expect((await dataStorage.getJson(stateKeyInDataStorage) as VersionedObject<State>).obj).not.toEqual(initState);
    })
    it('should make a persistent version of State with the persistentStateFactory, wrap it into VersionedObject with a correct version and set a correct key-item value in DataStorage', async () => {
      const state = { state: 'test' };
      const persistentState = { state: 'persistent state' };
      const persistentStateFactory = jest.fn(() => persistentState)
      const curVer = 1;
      const dataStorage = withJson(createInMemoryDataStorage());
      const stateStorage = createStateStorage(
        dataStorage,
        stateKeyInDataStorage,
        curVer,
        5000,
        s => s,
        persistentStateFactory
      )

      stateStorage.saveState(state);

      jest.advanceTimersByTime(5000);

      const itemInStorage = await dataStorage.getJson(stateKeyInDataStorage) as VersionedObject<object>;
      expect(itemInStorage.ver).toBe(curVer);
      expect(itemInStorage.obj).toEqual(persistentState);
      expect(persistentStateFactory).toBeCalledTimes(1);
      expect(persistentStateFactory).toBeCalledWith(state);
    })
  })
})
