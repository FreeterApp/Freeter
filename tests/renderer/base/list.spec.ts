/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { addItemToList, moveItemInList, removeItemFromList } from '@/base/list';

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
})
