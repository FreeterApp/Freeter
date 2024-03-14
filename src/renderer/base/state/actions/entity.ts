/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, EntityCollection, EntityUpdate, getEntitiesArrayFromEntityCollection, getManyFromEntityCollection, getOneFromEntityCollection, removeManyFromEntityCollection, removeOneFromEntityCollection, setManyInEntityCollection, setOneInEntityCollection, updateManyInEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { EntityIdList } from '@/base/entityList';
import { AppState } from '@/base/state/app';
import { EntitiesState } from '@/base/state/entities';

type GetEntityTypeOfCollection<T> = T extends EntityCollection<infer Entity> ? Entity : never;

function updateEntityState<K extends keyof EntitiesState>(state: AppState, key: K, newEntities: EntitiesState[K]): AppState {
  if (state.entities[key] !== newEntities) {
    return {
      ...state,
      entities: {
        ...state.entities,
        [key]: newEntities
      }
    }
  } else {
    return state;
  }
}

function createActions<K extends keyof EntitiesState>(key: K) {
  return {
    addMany: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      entities: EntityCollection<E> | ReadonlyArray<E>
    ) => updateEntityState(
      state,
      key,
      addManyToEntityCollection(state.entities[key] as EntityCollection<E>, entities) as EntitiesState[K]
    ),
    addOne: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      entity: E
    ) => updateEntityState(
      state,
      key,
      addOneToEntityCollection(state.entities[key] as EntityCollection<E>, entity) as EntitiesState[K]
    ),
    setMany: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      entities: EntityCollection<E> | ReadonlyArray<E>
    ) => updateEntityState(
      state,
      key,
      setManyInEntityCollection(state.entities[key] as EntityCollection<E>, entities) as EntitiesState[K]
    ),
    setAll: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      entities: EntityCollection<E> | ReadonlyArray<E>
    ) => updateEntityState(
      state,
      key,
      setManyInEntityCollection({} as EntityCollection<E>, entities) as EntitiesState[K]
    ),
    setOne: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      entity: E
    ) => updateEntityState(
      state,
      key,
      setOneInEntityCollection(state.entities[key] as EntityCollection<E>, entity) as EntitiesState[K]
    ),
    removeAll: (
      state: AppState
    ) => updateEntityState(
      state,
      key,
      {}
    ),
    removeMany: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      ids: ReadonlyArray<EntityId>
    ) => updateEntityState(
      state,
      key,
      removeManyFromEntityCollection(state.entities[key] as EntityCollection<E>, ids) as EntitiesState[K]
    ),
    removeOne: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      id: EntityId
    ) => updateEntityState(
      state,
      key,
      removeOneFromEntityCollection(state.entities[key] as EntityCollection<E>, id) as EntitiesState[K]
    ),
    updateMany: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      updates: ReadonlyArray<EntityUpdate<E>>
    ) => updateEntityState(
      state,
      key,
      updateManyInEntityCollection(state.entities[key] as EntityCollection<E>, updates) as EntitiesState[K]
    ),
    updateOne: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      update: EntityUpdate<E>
    ) => updateEntityState(
      state,
      key,
      updateOneInEntityCollection(state.entities[key] as EntityCollection<E>, update) as EntitiesState[K]
    ),
    get: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState
    ) => state.entities[key] as EntityCollection<E>,
    getMany: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      ids: EntityIdList
    ) => getManyFromEntityCollection(state.entities[key] as EntityCollection<E>, ids),
    getOne: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState,
      id: EntityId
    ) => getOneFromEntityCollection(state.entities[key] as EntityCollection<E>, id),
    getAsArray: <E extends GetEntityTypeOfCollection<EntitiesState[K]>>(
      state: AppState
    ) => getEntitiesArrayFromEntityCollection(state.entities[key] as EntityCollection<E>)
  }
}

export const entityStateActions = {
  projects: createActions('projects'),
  widgetTypes: createActions('widgetTypes'),
  widgets: createActions('widgets'),
  workflows: createActions('workflows')
}
