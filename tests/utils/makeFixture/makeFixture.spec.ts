/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { makeFixture } from './makeFixture';

describe('makeFixture', () => {
  it('allows to make a fixure for an object', function () {
    const fixture = makeFixture({
      str: '',
      num: 0,
      bool: false,
      obj: {
        str1: 'val2',
        num1: 2,
        bool1: true,
        obj1: {},
        arr1: [123, 'abc', { str4: 'val4' }]
      },
      arr: [456, [789, false], 'def']
    })

    const testObj = fixture({
      str: 'newval1',
      arr: [444, [777]]
    });

    expect(testObj).toEqual({
      str: 'newval1',
      num: 0,
      bool: false,
      obj: {
        str1: 'val2',
        num1: 2,
        bool1: true,
        obj1: {},
        arr1: [123, 'abc', { str4: 'val4' }]
      },
      arr: [444, [777]]
    })
  });

  it('should create immutable objects', function () {
    const fixture = makeFixture({ key1: 'val1', key2: 'val2' });

    const testObj = fixture({ key1: 'val2' })

    expect(() => testObj.key1 = 'val3').toThrowError();
  });
});
