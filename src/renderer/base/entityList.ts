/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { EntityCollection } from '@/base/entityCollection';
import { List, addItemToList, moveItemInList, removeItemFromList } from '@/base/list';

export type EntityIdList = List<EntityId>;
export type EntityList<T extends Entity> = List<T>;

export function mapIdListToEntityList<T extends Entity>(collection: EntityCollection<T>, ids: EntityIdList): EntityList<T> {
  return ids.map(id => collection[id]).filter((item): item is T => !!item);
}

export function mapEntityListToIdList(entities: EntityList<Entity>): EntityIdList {
  return entities.map(entity => entity.id);
}

export function findEntityOnList<T extends Entity>(list: EntityList<T>, id: EntityId): T | undefined {
  return list.find(item => item.id === id);
}

export function findEntityIndexOnList<T extends Entity>(list: EntityList<T>, id: EntityId): number {
  return list.findIndex(item => item.id === id);
}

export function findIdIndexOnList(list: EntityIdList, id: EntityId): number {
  return list.findIndex(item => item === id);
}

export const addEntityToList: <T extends Entity>(list: EntityList<T>, entity: T, index?: number) => EntityList<T> = addItemToList;

export const removeEntityFromListAtIndex: <T extends Entity>(list: EntityList<T>, index: number) => EntityList<T> = removeItemFromList;

export const removeIdFromListAtIndex: (list: EntityIdList, index: number) => EntityIdList = removeItemFromList;

export const moveEntityInListByIndex: <T extends Entity>(list: EntityList<T>, fromIndex: number, toIndex?: number) => EntityList<T> = moveItemInList;

export function updateEntityOnList<T extends Entity>(list: EntityList<T>, update: Partial<T>): EntityList<T> {
  return list.map(item => item.id === update.id ? { ...item, ...update } : item);
}

export function moveEntityInList<T extends Entity>(list: EntityList<T>, moveItemId: EntityId, targetItemId: EntityId | null): EntityList<T> {
  const fromIdx = findEntityIndexOnList(list, moveItemId);
  if (fromIdx < 0) {
    return list;
  }

  let toIdx = targetItemId === null ? -1 : findEntityIndexOnList(list, targetItemId);
  if (toIdx < 0) {
    toIdx = list.length - 1;
  }

  if (fromIdx === toIdx) {
    return list;
  }

  return moveEntityInListByIndex(list, fromIdx, toIdx);
}

export function removeEntityFromList<T extends Entity>(list: EntityList<T>, entityIdToRemove: EntityId): EntityList<T> {
  const removeIdx = findEntityIndexOnList(list, entityIdToRemove);
  if (removeIdx < 0) {
    return list
  }

  return removeEntityFromListAtIndex(list, removeIdx);
}

export function removeIdFromList(list: EntityIdList, idToRemove: EntityId): EntityIdList {
  const removeIdx = findIdIndexOnList(list, idToRemove);
  if (removeIdx < 0) {
    return list
  }

  return removeIdFromListAtIndex(list, removeIdx);
}
