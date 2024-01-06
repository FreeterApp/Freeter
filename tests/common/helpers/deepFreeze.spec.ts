/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { deepFreeze } from '@common/helpers/deepFreeze';

describe('deepFreeze', () => {
  describe('when it gets an object argument', () => {
    it('freezes the object and all its properties recursively and returns it', function () {
      const obj = {
        str: 'string',
        num: 5,
        bool: true,
        obj: {
          str: 'string',
          obj: {
            str: 'string'
          }
        },
        arr: ['string', 50, false, { str: 'string' }]
      };

      const frozenObj = deepFreeze(obj);
      expect(frozenObj).toEqual(obj);

      expect(Object.isFrozen(obj)).toEqual(true);
      expect(Object.isFrozen(obj.obj)).toEqual(true);
      expect(Object.isFrozen(obj.obj.obj)).toEqual(true);
      expect(Object.isFrozen(obj.arr)).toEqual(true);

      obj.arr.forEach(item => expect(Object.isFrozen(item)).toEqual(true));
    });

    it('throws an error on mutations of the frozen object', () => {
      const obj = {
        str: 'string'
      };

      const frozenObj = deepFreeze(obj);
      expect(frozenObj).toEqual(obj);

      expect(() => {
        obj.str = 'other string';
      }).toThrow();
    });

    it('throws an error on deep object mutations of the frozen object', () => {
      const obj = {
        obj: {
          str: 'string'
        }
      };

      const frozenObj = deepFreeze(obj);
      expect(frozenObj).toEqual(obj);

      expect(() => {
        obj.obj.str = 'other string';
      }).toThrow();
    });

    it('throws an error on deep array mutations of the frozen object', () => {
      const obj = {
        arr: ['string', 123]
      };

      const frozenObj = deepFreeze(obj);
      expect(frozenObj).toEqual(obj);

      expect(() => {
        obj.arr.push('one more string')
      }).toThrow();
    });
  })

  describe('when it gets an array argument', () => {
    it('freezes the array and all its elements recursively and returns it', function () {
      const deepObj = {
        str: 'string',
        obj: {
          str: 'string'
        }
      };
      const deepObj2 = { str: 'string' };
      const deepArr = ['string', 50, false, deepObj2];
      const arr = [
        'string',
        5,
        true,
        deepObj,
        deepArr
      ];

      const frozenArr = deepFreeze(arr);
      expect(frozenArr).toEqual(arr);

      expect(Object.isFrozen(arr)).toEqual(true);
      expect(Object.isFrozen(arr[3])).toEqual(true);
      expect(Object.isFrozen(deepObj.obj)).toEqual(true);
      expect(Object.isFrozen(arr[4])).toEqual(true);

      deepArr.forEach(item => expect(Object.isFrozen(item)).toEqual(true));
    });

    it('throws an error on mutations of the frozen array', () => {
      const arr = ['string'];

      const frozenArr = deepFreeze(arr);
      expect(frozenArr).toEqual(arr);

      expect(() => {
        arr.push('another string');
      }).toThrow();
    });

    it('throws an error on deep object mutations of the frozen array', () => {
      const arr = [{
        str: 'string'
      }];

      const frozenArr = deepFreeze(arr);
      expect(frozenArr).toEqual(arr);

      expect(() => {
        arr[0].str = 'other string';
      }).toThrow();
    });

    it('throws an error on deep array mutations of the frozen array', () => {
      const arr = [['string']];

      const frozenArr = deepFreeze(arr);
      expect(frozenArr).toEqual(arr);

      expect(() => {
        arr[0].push('another string');
      }).toThrow();
    });
  })
});
