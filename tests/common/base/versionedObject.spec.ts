/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createVersionedObject, unwrapVersionedObject, VersionedObject } from '@common/base/versionedObject';

describe('VersionedObject', () => {
  describe('createVersionedObject', () => {
    it('should wrap a provided object into VersionedObject', () => {
      const testObj = {
        str: 'val'
      }
      const testVer = 1;

      const versionedObject = createVersionedObject(testObj, testVer);

      expect(versionedObject.obj).toBe(testObj);
      expect(versionedObject.ver).toBe(testVer);
    })
  })

  describe('unwrapVersionedObject', () => {
    it('should unwrap VersionedObject', () => {
      const testObj = {
        str: 'val'
      }
      const someVer = 1;
      const verObj: VersionedObject<typeof testObj> = {
        ver: someVer,
        obj: testObj
      }

      const unwrappedObj = unwrapVersionedObject(verObj, someVer, (obj) => obj);

      expect(unwrappedObj).toBe(testObj);
    })

    it('should not call the provided migrate function, if the version equals to VersionedObject\'s version', () => {
      const someObj = {
        str: 'val'
      }
      const someVer = 1;
      const testMigrate = jest.fn();
      const verObj: VersionedObject<typeof someObj> = {
        ver: someVer,
        obj: someObj
      }

      unwrapVersionedObject(verObj, someVer, testMigrate);

      expect(testMigrate).not.toBeCalled();
    })

    it('should call the provided migrate function with right args and return its value, if the version is not equal to VersionedObject\'s version', () => {
      const obj = {
        str: 'val'
      }
      const migrateToObj = {
        str2: 'val'
      }
      const ver1 = 1;
      const ver2 = 2;
      const migrate = jest.fn(() => migrateToObj);
      const verObj: VersionedObject<typeof obj> = {
        ver: ver1,
        obj
      }

      const unwrappedObj = unwrapVersionedObject(verObj, ver2, migrate);

      expect(migrate).toBeCalledWith(obj, ver1);
      expect(unwrappedObj).toBe(migrateToObj);
    })
  })
});
