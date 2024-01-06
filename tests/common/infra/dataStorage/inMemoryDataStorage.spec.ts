/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';

describe('InMemoryDataStorage', () => {
  it('should allow to create storage with an init state', async () => {
    const initKey = 'Init key';
    const testItem = 'val';
    const storage = createInMemoryDataStorage({
      [initKey]: testItem
    })

    expect(await storage.getText(initKey)).toBe(testItem);
  })

  it('should allow to create empty storage without init state', async () => {
    const storage = createInMemoryDataStorage()

    expect(await storage.getText('unexisting key')).toBeUndefined();
  })

  it('should allow to get text by key', async () => {
    const initKey = 'Init key';
    const testItem = 'val';
    const storage = createInMemoryDataStorage({
      [initKey]: testItem
    })

    expect(await storage.getText(initKey)).toBe(testItem);
    expect(await storage.getText('unexisting key')).toBeUndefined();
  })

  it('should allow to set text by key', async () => {
    const setKey = 'Set key';
    const testItem = 'val';
    const testItem2 = 'val2';
    const storage = createInMemoryDataStorage();

    await storage.setText(setKey, testItem)
    expect(await storage.getText(setKey)).toBe(testItem);

    await storage.setText(setKey, testItem2)
    expect(await storage.getText(setKey)).toBe(testItem2);
  })

  it('should allow to delete item by key', async () => {
    const initKey = 'Init key';
    const testItem = 'val';
    const storage = createInMemoryDataStorage()
    await storage.setText(initKey, testItem)

    await storage.deleteItem(initKey);

    expect(await storage.getText(initKey)).toBeUndefined();
  })

  it('should allow to clear the storage', async () => {
    const testKey1 = 'key1';
    const testItem1 = 'val1';
    const testKey2 = 'key2';
    const testItem2 = 'val2';
    const storage = createInMemoryDataStorage({
      [testKey1]: testItem1,
      [testKey2]: testItem2,
    })

    await storage.clear();

    expect(await storage.getText(testKey1)).toBeUndefined();
    expect(await storage.getText(testKey2)).toBeUndefined();
  })

  it('should allow to get all keys', async () => {
    const testKey1 = 'key1';
    const testKey2 = 'key2';
    const storage = createInMemoryDataStorage({
      [testKey1]: 'val1',
      [testKey2]: 'val2',
    })

    expect(await storage.getKeys()).toEqual([testKey1, testKey2]);
  })
})
