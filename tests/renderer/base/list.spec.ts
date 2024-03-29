/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { addItemToList, addOrMoveItemInList, findIndexOrUndef, limitListLength, moveItemInList, removeItemFromList } from '@/base/list';

describe('List', () => {
  describe('addItemToList()', () => {
    it('should add the item to the end of a list, if no target index is specified', () => {
      const list = [
        'A',
        'B'
      ];
      const item = 'C';

      const newList = addItemToList(list, item);

      expect(newList).toEqual([...list, item]);
    })

    it('should add the item to the list at the specified index', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const idx = 2;
      const item = 'D'

      const newList = addItemToList(list, item, idx);

      expect(newList).toEqual([list[0], list[1], item, list[2]]);
    })
  })

  describe('removeItemFromList()', () => {
    it('should remove the item on the list at index', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const idx = 1;

      const newList = removeItemFromList(list, idx);

      expect(newList).toEqual([list[0], list[2]]);
    })

    it('should return the original list if index < 0', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const idx = -1;

      const newList = removeItemFromList(list, idx);

      expect(newList).toBe(list);
    })

    it('should return the original list if index >== length', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const idx = list.length;

      const newList = removeItemFromList(list, idx);

      expect(newList).toBe(list);
    })
  })

  describe('moveItemInList()', () => {
    it('should return the original list if fromIndex === toIndex', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const fromIdx = 1;
      const toIdx = 1;

      const newList = moveItemInList(list, fromIdx, toIdx);

      expect(newList).toBe(list);
    })

    it('should move the item on the list from index to index', () => {
      const list = [
        'A',
        'B',
        'C',
        'D'
      ];
      const fromIdx = 1;
      const toIdx = 2;

      const newList = moveItemInList(list, fromIdx, toIdx);

      expect(newList).toEqual([list[0], list[2], list[1], list[3]]);
    })

    it('should move the item on the list to the end if toIndex is undefined', () => {
      const list = [
        'A',
        'B',
        'C',
        'D'
      ];
      const fromIdx = 1;
      const toIdx = undefined;

      const newList = moveItemInList(list, fromIdx, toIdx);

      expect(newList).toEqual([list[0], list[2], list[3], list[1]]);
    })

  })

  describe('findIndexOrUndef()', () => {
    it('should return the index of the item on the list, if it exists', () => {
      const list = [
        'A',
        'B',
        'C'
      ];

      const gotIdx = findIndexOrUndef(list, 'B');

      expect(gotIdx).toBe(1);
    })

    it('should return undefined, if the item is undefined', () => {
      const list = [
        'A',
        undefined,
        'C'
      ];

      const gotIdx = findIndexOrUndef(list, undefined);

      expect(gotIdx).toBeUndefined();
    })

    it('should return undefined, if the item does not exist on the list', () => {
      const list = [
        'A',
        'B',
        'C'
      ];

      const gotIdx = findIndexOrUndef(list, 'D');

      expect(gotIdx).toBeUndefined();
    })
  })

  describe('addOrMoveItemInList()', () => {
    it('should add the item to the list at the specified index, when it does not exist', () => {
      const list = [
        'A',
        'B',
        'C'
      ];
      const item = 'D'

      const newList = addOrMoveItemInList(list, item, 2);

      expect(newList).toEqual([list[0], list[1], item, list[2]]);
    })
    it('should move the item in the list to the specified index, when it already exists', () => {
      const list = [
        'A',
        'B',
        'C'
      ];

      const newList = addOrMoveItemInList(list, list[2], 1);

      expect(newList).toEqual([list[0], list[2], list[1]]);
    })
  })

  describe('limitListLength()', () => {
    it('should remove items at the end of the list to fit the specified length, and return the removed items', () => {
      const list = [
        'A',
        'B',
        'C',
        'D',
        'E'
      ];

      const [newList, deleted] = limitListLength(list, 3);

      expect(newList).toEqual([list[0], list[1], list[2]]);
      expect(deleted).toEqual([list[3], list[4]]);
    })

    it('should do nothing and return empty array of deleted items, when the list fits the specified length', () => {
      const list = [
        'A',
        'B',
        'C',
        'D',
        'E'
      ];

      const [newList, deleted] = limitListLength(list, 10);

      expect(newList === list).toBe(true);
      expect(deleted).toEqual([]);
    })
  })
})
