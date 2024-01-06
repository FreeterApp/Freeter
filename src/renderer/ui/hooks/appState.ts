/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { EntityCollection } from '@/base/entityCollection';
import { EntityIdList, EntityList, mapIdListToEntityList } from '@/base/entityList';
import { AppState } from '@/base/state/app';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { StoreApi } from 'zustand/vanilla'
import { shallow } from 'zustand/vanilla/shallow';

type GetEntityType<T> = T extends EntityCollection<infer U> ? U : never;

export type AppStoreForUi = StoreApi<AppState>;

export interface UseAppState {
  <U>(selector: (s: AppState) => U): U;
  useWithStrictEq<U>(selector: (s: AppState) => U): U;
  useWithCustomEq<U>(selector: (s: AppState) => U, equals: (a: U, b: U) => boolean): U;
  useEntityList<U extends EntityCollection<Entity>>(
    collSelector: (s: AppState) => U,
    idList: EntityIdList
  ): EntityList<GetEntityType<U>>;
  useEntityListIfIdsDefined<U extends EntityCollection<Entity>>(
    collSelector: (s: AppState) => U,
    idList: EntityIdList | undefined
  ): EntityList<GetEntityType<U>> | undefined;
}

export function createAppStateHook(appStoreForUi: AppStoreForUi): UseAppState {
  function _useAppState<T>(
    selector: (state: AppState) => T,
    equals?: (a: T, b: T) => boolean
  ): T {
    return useStoreWithEqualityFn(appStoreForUi, selector, equals)
  }

  const useAppState: UseAppState = selector => _useAppState(selector, shallow);
  useAppState.useWithStrictEq = selector => _useAppState(selector);
  useAppState.useWithCustomEq = (selector, equals) => _useAppState(selector, equals);
  useAppState.useEntityList = (collSelector, idList) => _useAppState(
    state => mapIdListToEntityList(collSelector(state), idList) as EntityList<GetEntityType<ReturnType<typeof collSelector>>>,
    shallow
  );
  useAppState.useEntityListIfIdsDefined = (collSelector, idList) => _useAppState(
    state =>
      idList !== undefined
        ? mapIdListToEntityList(collSelector(state), idList) as EntityList<GetEntityType<ReturnType<typeof collSelector>>>
        : undefined,
    shallow
  );
  return useAppState;
}
