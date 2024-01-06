/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity } from '@/base/entity';
import { addEntityToList, EntityIdList, EntityList, findEntityIndexOnList, findEntityOnList, findIdIndexOnList, moveEntityInList, moveEntityInListByIndex, removeEntityFromList, removeEntityFromListAtIndex, removeIdFromList, removeIdFromListAtIndex, updateEntityOnList } from '@/base/entityList';
import { addItemToList, moveItemInList, removeItemFromList } from '@/base/list';
import { fixtureEntityA, fixtureEntityB, fixtureEntityC, fixtureEntityD, fixtureEntityWithPropsA, fixtureEntityWithPropsB, fixtureEntityWithPropsC } from '@tests/base/fixtures/entity';

describe('EntityList', () => {
  describe('findEntityOnList()', () => {
    it('should find a right entity on a list', () => {
      const id1 = 'TEST-ID-1';
      const id2 = 'TEST-ID-2';
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: id1 }),
        fixtureEntityB(),
        fixtureEntityC(),
        fixtureEntityD({ id: id2 })
      ];
      const expectedItem1 = list[0];
      const expectedItem2 = list[3];

      const resItem1 = findEntityOnList(list, id1);
      const resItem2 = findEntityOnList(list, id2);

      expect(resItem1).toBe(expectedItem1);
      expect(resItem2).toBe(expectedItem2);
    })

    it('should return undefined if it cannot find an entity', () => {
      const list: EntityList<Entity> = [
        fixtureEntityA()
      ];

      const resItem = findEntityOnList(list, 'no-such-id');

      expect(resItem).toBeUndefined();
    })
  })

  describe('findEntityIndexOnList()', () => {
    it('should find a right entity index on a list', () => {
      const id1 = 'TEST-ID-1';
      const id2 = 'TEST-ID-2';
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: id1 }),
        fixtureEntityB(),
        fixtureEntityC(),
        fixtureEntityD({ id: id2 })
      ];

      const resItem1 = findEntityIndexOnList(list, id1);
      const resItem2 = findEntityIndexOnList(list, id2);

      expect(resItem1).toBe(0);
      expect(resItem2).toBe(3);
    })

    it('should return -1 if it cannot find an entity', () => {
      const list: EntityList<Entity> = [
        fixtureEntityA()
      ];

      const resItem = findEntityIndexOnList(list, 'no-such-id');

      expect(resItem).toBe(-1);
    })
  })

  describe('findIdIndexOnList()', () => {
    it('should find a right id index on a list', () => {
      const id1 = 'TEST-ID-1';
      const id2 = 'TEST-ID-2';
      const list = [
        id1,
        'SOME ID',
        'ANOTHER IF',
        id2
      ];

      const resItem1 = findIdIndexOnList(list, id1);
      const resItem2 = findIdIndexOnList(list, id2);

      expect(resItem1).toBe(0);
      expect(resItem2).toBe(3);
    })

    it('should return -1 if it cannot find the id', () => {
      const list = [
        'SOME ID'
      ];

      const resItem = findIdIndexOnList(list, 'no-such-id');

      expect(resItem).toBe(-1);
    })
  })

  describe('addEntityToList()', () => {
    it('should be an alias for addItemToList', () => {
      expect(addEntityToList).toBe(addItemToList);
    })
  })

  describe('removeEntityFromListAtIndex()', () => {
    it('should be an alias for removeItemFromList', () => {
      expect(removeEntityFromListAtIndex).toBe(removeItemFromList);
    })
  })

  describe('removeIdFromListAtIndex()', () => {
    it('should be an alias for removeItemFromList', () => {
      expect(removeIdFromListAtIndex).toBe(removeItemFromList);
    })
  })

  describe('moveEntityInListByIndex()', () => {
    it('should be an alias for moveItemInList', () => {
      expect(moveEntityInListByIndex).toBe(moveItemInList);
    })
  })

  describe('updateEntityOnList()', () => {
    it('should update provided props of an entity specified by id', () => {
      const testId = 'TEST-ID';
      const origList = [
        fixtureEntityWithPropsA(),
        fixtureEntityWithPropsB({
          id: testId,
          propNum: 10,
          propStr: 'TEST-STR',
          propBool: true
        }),
        fixtureEntityWithPropsC()
      ];
      const expectList = [
        origList[0],
        {
          ...origList[1],
          propNum: 20
        },
        origList[2]
      ];

      const newList = updateEntityOnList(origList, { id: testId, propNum: 20 });

      expect(newList).toEqual(expectList);
    })
  })

  describe('moveEntityInList()', () => {
    it('should return the original array if the order is not changed (target id === source id)', () => {
      const testId = 'TEST-ID'
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: testId }),
        fixtureEntityB()
      ];

      const updList = moveEntityInList(list, testId, testId);

      expect(updList).toBe(list);
    })

    it('should correctly move item (if current idx < target idx)', () => {
      const testIdFrom = 'TEST-ID-1';
      const testIdTo = 'TEST-ID-2';
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: testIdFrom }),
        fixtureEntityB(),
        fixtureEntityC({ id: testIdTo }),
        fixtureEntityD()
      ];

      const updList = moveEntityInList(list, testIdFrom, testIdTo);

      expect(updList).toEqual([list[1], list[2], list[0], list[3]]);
    })

    it('should correctly move item (if current idx > target idx)', () => {
      const testIdFrom = 'TEST-ID-1';
      const testIdTo = 'TEST-ID-2';
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: testIdTo }),
        fixtureEntityB(),
        fixtureEntityC(),
        fixtureEntityD({ id: testIdFrom })
      ];

      const updList = moveEntityInList(list, testIdFrom, testIdTo);

      expect(updList).toEqual([list[3], list[0], list[1], list[2]]);
    })

    it('should move item to the end of the list (if target is null)', () => {
      const testId = 'TEST-ID';
      const list: EntityList<Entity> = [
        fixtureEntityA({ id: testId }),
        fixtureEntityB(),
        fixtureEntityC()
      ];

      const updList = moveEntityInList(list, testId, null);

      expect(updList).toEqual([list[1], list[2], list[0]]);
    })

    it('should return the original array if the order is not changed (if target idx === current idx)', () => {
      const testId = 'TEST-ID';
      const list: EntityList<Entity> = [
        fixtureEntityA(),
        fixtureEntityB(),
        fixtureEntityC(),
        fixtureEntityD({ id: testId })
      ];

      const updList1 = moveEntityInList(list, testId, null);
      const updList2 = moveEntityInList(list, testId, testId);

      expect(updList1).toBe(list);
      expect(updList2).toBe(list);
    })
  })

  describe('removeEntityFromList()', () => {
    it('should return a new list without an item specified by id, if such id exists', () => {
      const testId = 'TEST-ID';
      const list: EntityList<Entity> = [
        fixtureEntityA(),
        fixtureEntityB({ id: testId })
      ];
      const expectList = [list[0]];

      const newList = removeEntityFromList(list, testId);

      expect(newList).toEqual(expectList);
    })

    it('should return the original list if there is no item with the specified id', () => {
      const list: EntityList<Entity> = [
        fixtureEntityA()
      ];

      const newList = removeEntityFromList(list, 'NO-SUCH-ID');

      expect(newList).toBe(list);
    })
  })

  describe('removeIdFromList()', () => {
    it('should return a new list without an item specified by id, if such id exists', () => {
      const testId = 'TEST-ID';
      const list: EntityIdList = ['A', testId];
      const expectList = [list[0]];

      const newList = removeIdFromList(list, testId);

      expect(newList).toEqual(expectList);
    })

    it('should return the original list if there is no item with the specified id', () => {
      const list: EntityIdList = ['A'];

      const newList = removeIdFromList(list, 'NO-SUCH-ID');

      expect(newList).toBe(list);
    })
  })
})
