/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createObjectManager } from '@common/base/objectManager';

describe('ObjectManager', () => {
  describe('getObject()', () => {
    it('should call the object factory function with the provided id and return the new object, when it is called first time for the id', async () => {
      const testId = 'test-id';
      const testRes = { test: 'res' };
      const objFactory = jest.fn(async () => testRes);
      const objectManager = createObjectManager(objFactory);

      const gotRes = await objectManager.getObject(testId);
      expect(objFactory).toBeCalledTimes(1);
      expect(objFactory).toBeCalledWith(testId);
      expect(gotRes).toBe(testRes);
    })

    it('should keep a created object in the cache and returned the cached instance', async () => {
      const testId = 'test-id';
      const testRes = { test: 'res' };
      const objFactory = jest.fn(async () => testRes);
      const objectManager = createObjectManager(objFactory);

      await objectManager.getObject(testId);
      const gotRes = await objectManager.getObject(testId);
      expect(objFactory).toBeCalledTimes(1);
      expect(gotRes).toBe(testRes);
    })

    it('should correctly work with multiple ids', async () => {
      const testId1 = 'test-id1';
      const testRes1 = { test: 'res1' };
      const testId2 = 'test-id2';
      const testRes2 = { test: 'res2' };
      const objFactory = jest.fn(async id => id === testId1 ? testRes1 : testRes2);
      const objectManager = createObjectManager(objFactory);

      const gotRes1a = await objectManager.getObject(testId1);
      const gotRes1b = await objectManager.getObject(testId1);
      const gotRes2a = await objectManager.getObject(testId2);
      const gotRes2b = await objectManager.getObject(testId2);
      expect(objFactory).toBeCalledTimes(2);
      expect(gotRes1a).toBe(testRes1);
      expect(gotRes1b).toBe(testRes1);
      expect(gotRes2a).toBe(testRes2);
      expect(gotRes2b).toBe(testRes2);
    })
  })
})
