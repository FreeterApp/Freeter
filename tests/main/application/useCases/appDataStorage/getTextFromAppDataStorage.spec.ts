/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createGetTextFromAppDataStorageUseCase } from '@/application/useCases/appDataStorage/getTextFromAppDataStorage';

function setup(initData?: Record<string, string>) {
  const appDataStorage = createInMemoryDataStorage(initData)
  const useCase = createGetTextFromAppDataStorageUseCase({
    appDataStorage
  });
  return {
    appDataStorage,
    useCase
  }
}

describe('getTextFromAppDataStorageUseCase()', () => {
  it('should get a text data from the data storage, when an item exists', async () => {
    const key = 'item';
    const val = 'text data';
    const { useCase } = setup({ [key]: val })

    const res = await useCase(key);

    expect(res).toBe(val);
  });

  it('should return undefined, when an item does not exist', async () => {
    const { useCase } = setup()

    const res = await useCase('unexisting-item');

    expect(res).toBeUndefined();
  });
})
