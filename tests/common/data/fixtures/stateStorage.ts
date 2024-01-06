/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { VersionedObject, createVersionedObject } from '@common/base/versionedObject'
import { createStateStorage } from '@common/data/stateStorage'
import { withJson } from '@common/infra/dataStorage/withJson';
import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage'

function fixtureStateStorageWithData<TState extends object = object>(
  opts?: { dataInDataStorage?: Record<string, VersionedObject<TState>>, stateKeyInDataStorage?: string, currentVer?: number }
) {
  const dataInDataStorage = opts?.dataInDataStorage || {};
  const stateKeyInDataStorage = opts?.stateKeyInDataStorage || 'some-key';
  const currentVer = opts?.currentVer !== undefined ? opts.currentVer : 1;
  return createStateStorage<TState, TState>(
    withJson(
      createInMemoryDataStorage(
        Object.fromEntries(
          Object.keys(dataInDataStorage).map(key => ([key, JSON.stringify(dataInDataStorage[key])]))
        )
      )
    ),
    stateKeyInDataStorage,
    currentVer,
    0,
    data => data as TState,
    data => data
  )
}

export function fixtureStateStorageWithNoData() {
  return fixtureStateStorageWithData()
}

export function fixtureStateStorageWithInvalidData(
  initData: object
) {
  const curVer = 1;
  const stateKey = 'state-key';
  return fixtureStateStorageWithData({
    currentVer: curVer,
    stateKeyInDataStorage: stateKey,
    dataInDataStorage: {
      [stateKey]: createVersionedObject(initData, curVer)
    }
  })
}

export function fixtureStateStorageWithValidData<TState extends object>(
  state: TState
) {
  const curVer = 1;
  const stateKey = 'state-key';
  return fixtureStateStorageWithData({
    currentVer: curVer,
    stateKeyInDataStorage: stateKey,
    dataInDataStorage: {
      [stateKey]: createVersionedObject(state, curVer)
    }
  })
}
