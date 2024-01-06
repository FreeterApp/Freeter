/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from './entity';
import { EntityIdList } from './entityList';

export type EntityCollection<T extends Entity> = Record<EntityId, T | undefined>;

export type EntityUpdate<T extends Entity> = { id: EntityId; changes: Partial<T> }

function toEntitiesArray<T extends Entity>(
  entities: ReadonlyArray<T> | EntityCollection<T>
): ReadonlyArray<T> {
  if (!Array.isArray(entities)) {
    return Object.values(entities) as T[];
  }

  return entities;
}

function merge<T extends Entity>(
  collection: EntityCollection<T>,
  entities: ReadonlyArray<T>
): EntityCollection<T> {
  const newCollection = { ...collection };
  entities.forEach((entity) => {
    newCollection[entity.id] = entity;
  })
  return newCollection;
}

export function addManyToEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  entities: EntityCollection<T> | ReadonlyArray<T>
): EntityCollection<T> {
  const newEntities = toEntitiesArray(entities).filter(
    (entity) => !(entity.id in collection)
  )

  if (newEntities.length !== 0) {
    return merge(collection, newEntities);
  } else {
    return collection;
  }
}

export function addOneToEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  entity: T
): EntityCollection<T> {
  return addManyToEntityCollection(collection, [entity]);
}

export function setManyInEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  entities: EntityCollection<T> | ReadonlyArray<T>
): EntityCollection<T> {
  const updEntities = toEntitiesArray(entities);

  if (updEntities.length !== 0) {
    return merge(collection, updEntities);
  } else {
    return collection;
  }
}

export function setOneInEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  entity: T
): EntityCollection<T> {
  return setManyInEntityCollection(collection, [entity]);
}

export function createEntityCollection<T extends Entity>(
  entities?: ReadonlyArray<T>
): EntityCollection<T> {
  if (entities) {
    return merge({}, entities);
  } else {
    return {};
  }
}

export function removeManyFromEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  ids: ReadonlyArray<EntityId>
): EntityCollection<T> {
  const newCollection = { ...collection };
  let changed = false;
  for (const id of ids) {
    if (newCollection[id]) {
      changed = true;
      delete newCollection[id];
    }
  }

  if (changed) {
    return newCollection;
  } else {
    return collection;
  }
}

export function removeOneFromEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  id: EntityId
): EntityCollection<T> {
  return removeManyFromEntityCollection(collection, [id]);
}

export function updateManyInEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  updates: ReadonlyArray<EntityUpdate<T>>
): EntityCollection<T> {
  let changed = false;
  const newCollection = { ...collection };

  for (const update of updates) {
    const entity = collection[update.id]
    if (!entity) {
      continue
    }

    changed = true;

    const newEntity = {
      ...entity,
      ...update.changes
    }
    if (update.id !== newEntity.id) {
      delete newCollection[update.id];
    }
    newCollection[newEntity.id] = newEntity;
  }

  if (changed) {
    return newCollection;
  } else {
    return collection;
  }
}

export function updateOneInEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  update: EntityUpdate<T>
): EntityCollection<T> {
  return updateManyInEntityCollection(collection, [update]);
}

export function getManyFromEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  ids: EntityIdList
): ReadonlyArray<T | undefined> {
  return ids.map(id => collection[id]);
}

export function getOneFromEntityCollection<T extends Entity>(
  collection: EntityCollection<T>,
  id: EntityId
): T | undefined {
  return collection[id];
}

export function getEntitiesArrayFromEntityCollection<T extends Entity>(
  collection: EntityCollection<T>
): ReadonlyArray<T> {
  return Object.values(collection) as T[];
}

export function mapEntityCollection<T extends Entity, Y extends Entity>(
  collection: EntityCollection<T>,
  callbackFn: (entity: T) => Y
): EntityCollection<Y> {
  return Object.fromEntries(
    Object.values(collection).map(entity => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newEntity = callbackFn(entity!);
      return [newEntity.id, newEntity];
    })
  )
}
