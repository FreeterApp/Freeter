/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, createEntityCollection, getEntitiesArrayFromEntityCollection, getManyFromEntityCollection, getOneFromEntityCollection, mapEntityCollection, removeManyFromEntityCollection, removeOneFromEntityCollection, setManyInEntityCollection, setOneInEntityCollection, updateManyInEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { makeFixture } from '@utils/makeFixture';

interface SomeEntity extends Entity {
  readonly str: string;
  readonly num: number;
  readonly obj: object;
  readonly arr: unknown[];
}

const entities: SomeEntity[] = [{
  id: 'A',
  str: 'A',
  num: 1,
  obj: { strInObj: 'AInObj', objInObj: {} },
  arr: ['AInArr', 111]
}, {
  id: 'B',
  str: 'B',
  num: 2,
  obj: { strInObj: 'BInObj', objInObj: {} },
  arr: ['BInArr', 222]
}, {
  id: 'C',
  str: 'C',
  num: 3,
  obj: { strInObj: 'CInObj', objInObj: {} },
  arr: ['CInArr', 333]
}]

const fixtureEntityA = makeFixture(entities[0]);
const fixtureEntityB = makeFixture(entities[1]);
const fixtureEntityC = makeFixture(entities[2]);

describe('EntityCollection', () => {
  it('should allow to create a collection with an array', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();

    const coll = createEntityCollection([entityA, entityB]);

    expect(coll).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
    })
  })
  it('should allow to get one entity', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const coll = createEntityCollection([entityA, entityB]);

    const got = getOneFromEntityCollection(coll, entityB.id);

    expect(got).toBe(entityB);
  })

  it('should allow to get many entities', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA, entityB, entityC]);

    const got = getManyFromEntityCollection(coll, [entityB.id, entityA.id]);

    expect(got).toEqual([entityB, entityA]);
  })

  it('should allow to get all entities as array', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA, entityB, entityC]);

    const got = getEntitiesArrayFromEntityCollection(coll);

    expect(got).toEqual([entityA, entityB, entityC]);
  })

  it('should allow to add one entity', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const coll = createEntityCollection([entityA]);

    const collAfterAdd = addOneToEntityCollection(coll, entityB);

    expect(collAfterAdd).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
    })
  })

  it('should not change state when re-add an entity', () => {
    const entity = fixtureEntityA();
    const coll = createEntityCollection([entity]);

    const collAfterAdd = addOneToEntityCollection(coll, entity);

    expect(collAfterAdd).toBe(coll);
  })

  it('should allow to add many entities', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA]);

    const collAfterAdd = addManyToEntityCollection(coll, [entityB, entityC]);

    expect(collAfterAdd).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    })
  })

  it('should allow to add many entities from an entity collection', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA]);

    const collAfterAdd = addManyToEntityCollection(coll, {
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    });

    expect(collAfterAdd).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    })
  })

  it('should allow to remove an entity', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const coll = createEntityCollection([entityA, entityB]);

    const collAfterRemove = removeOneFromEntityCollection(coll, entityA.id);

    expect(collAfterRemove).toEqual({
      [entityB.id]: entityB,
    })
  })

  it('should allow to remove many entities', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA, entityB, entityC]);

    const collAfterRemove = removeManyFromEntityCollection(coll, [entityA.id, entityB.id]);

    expect(collAfterRemove).toEqual({
      [entityC.id]: entityC,
    })
  })

  it('should allow to update an entity', () => {
    const entityA = fixtureEntityA();
    const changes = { str: 'Changed Str' };
    const coll = createEntityCollection([entityA]);

    const collAfterUpdate = updateOneInEntityCollection(coll, {
      id: entityA.id,
      changes,
    })

    expect(collAfterUpdate).toEqual({
      [entityA.id]: {
        ...entityA,
        ...changes
      }
    })
  })

  it('should return the same collection when trying to update an entity that has not been added', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const coll = createEntityCollection([entityA]);

    const collAfterUpdate = updateOneInEntityCollection(coll, {
      id: entityB.id,
      changes: {
        str: 'New Str'
      },
    })

    expect(collAfterUpdate).toBe(coll);
  })

  it('should replace an existing entity if the ID is changed while updating', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA, entityB, entityC]);

    const collAfterUpdate = updateOneInEntityCollection(coll, {
      id: entityB.id,
      changes: {
        id: entityC.id
      }
    })

    expect(collAfterUpdate).toEqual({
      [entityA.id]: entityA,
      [entityC.id]: {
        ...entityB,
        id: entityC.id
      }
    })
  })

  it('should allow to update the id of entity', () => {
    const entityA = fixtureEntityA();
    const changes = { id: 'New Id' }
    const coll = createEntityCollection([entityA]);

    const collAfterUpdate = updateOneInEntityCollection(coll, {
      id: entityA.id,
      changes
    })

    expect(collAfterUpdate).toEqual({
      [changes.id]: {
        ...entityA,
        ...changes
      }
    })
  })

  it('should allow to update many entities by id', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const changes1 = { str: 'New Str' }
    const changes2 = { num: 12345678 }
    const coll = createEntityCollection([entityA, entityB]);

    const collAfterUpdate = updateManyInEntityCollection(coll, [
      { id: entityA.id, changes: changes1 },
      { id: entityB.id, changes: changes2 },
    ]);

    expect(collAfterUpdate).toEqual({
      [entityA.id]: {
        ...entityA,
        ...changes1
      },
      [entityB.id]: {
        ...entityB,
        ...changes2
      },
    })
  })

  it('should allow to add a new entity with setOne()', () => {
    const entityA = fixtureEntityA();
    const entityB = fixtureEntityB();
    const entityC = fixtureEntityC();
    const coll = createEntityCollection([entityA, entityB]);

    const collAfterSet = setOneInEntityCollection(coll, entityC);

    expect(collAfterSet).toEqual({
      [entityA.id]: entityA,
      [entityB.id]: entityB,
      [entityC.id]: entityC,
    })
  })

  it('should allow to replace an entity with setOne()', () => {
    const entityA = fixtureEntityA();
    const coll = createEntityCollection([entityA]);

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const collAfterSet = setOneInEntityCollection(coll, updatedEntityA);

    expect(collAfterSet).toEqual({
      [entityA.id]: updatedEntityA,
    })
  })

  it('should return the original collection when setMany is given an empty array', () => {
    const entityA = fixtureEntityA();
    const coll = createEntityCollection([entityA]);

    const collAfterSet = setManyInEntityCollection(coll, []);

    expect(collAfterSet).toEqual({
      [entityA.id]: entityA,
    })
  })

  it('should allow to set many entities', () => {
    const entityA = fixtureEntityA();
    const coll = createEntityCollection([entityA]);

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const entityC = fixtureEntityC();
    const collAfterSet = setManyInEntityCollection(coll, [updatedEntityA, entityC]);

    expect(collAfterSet).toEqual({
      [entityA.id]: updatedEntityA,
      [entityC.id]: entityC
    })
  })

  it('should allow to set many entities when passing in an entity collection', () => {
    const entityA = fixtureEntityA();
    const coll = createEntityCollection([entityA]);

    const updatedEntityA = fixtureEntityB({ id: entityA.id })
    const entityC = fixtureEntityC();
    const collAfterSet = setManyInEntityCollection(coll, {
      [entityA.id]: updatedEntityA,
      [entityC.id]: entityC,
    });

    expect(collAfterSet).toEqual({
      [entityA.id]: updatedEntityA,
      [entityC.id]: entityC
    })
  })

  it('should allow to map an entity collection', () => {
    const entityA = {
      ...fixtureEntityA(),
      propA: 1,
      propB: 2
    }
    const entityB = {
      ...fixtureEntityB(),
      propA: 3,
      propB: 4
    }
    const coll = createEntityCollection([entityA, entityB]);

    const newColl = mapEntityCollection(coll, entity => {
      const { propA, ...newEntity } = entity;
      return newEntity;
    })

    expect(newColl).toEqual({
      [entityA.id]: { ...fixtureEntityA(), propB: 2 },
      [entityB.id]: { ...fixtureEntityB(), propB: 4 },
    })
  })
})
