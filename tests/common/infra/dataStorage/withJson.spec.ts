/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { withJson } from '@common/infra/dataStorage/withJson';

describe('withJson', () => {
  describe('getJson', () => {
    it('should get text from a dataStorage and return a js value/object, when the stored text can be parsed', async () => {
      const key = 'key';
      const value = { str: 'some text', obj: { num: 12345 } };
      const dataStorageJson = withJson(createInMemoryDataStorage({ [key]: JSON.stringify(value) }));

      const gotItem = await dataStorageJson.getJson(key);

      expect(gotItem).toEqual(value);
    })

    it('should return undefined, when the stored text cannot be parsed', async () => {
      const key = 'key';
      const dataStorageJson = withJson(createInMemoryDataStorage({ [key]: 'invalid data' }));

      const gotItem = await dataStorageJson.getJson(key);

      expect(gotItem).toBeUndefined();
    })

    it('should return undefined, when the dataStorage does not have the item', async () => {
      const dataStorageJson = withJson(createInMemoryDataStorage({ 'key': '{}' }));

      const gotItem = await dataStorageJson.getText('unexisting key');

      expect(gotItem).toBeUndefined();
    })
  })

  describe('setJson', () => {
    it('should convert a js value into a correct json string and put it into the dataStorage as text', async () => {
      const key = 'key';
      const value = { str: 'some text', obj: { num: 12345 } };
      const stringDataStorage = createInMemoryDataStorage();
      const dataStorageJson = withJson(stringDataStorage);

      await dataStorageJson.setJson(key, value);

      expect(JSON.parse(await stringDataStorage.getText(key) as string)).toEqual(value);
    })
  })
})
