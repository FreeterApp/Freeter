/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createDeleteInAppDataStorageUseCase } from '@/application/useCases/appDataStorage/deleteInAppDataStorage';

function setup(initData?: Record<string, string>) {
  const appDataStorage = createInMemoryDataStorage(initData)
  const useCase = createDeleteInAppDataStorageUseCase({
    appDataStorage
  });
  return {
    appDataStorage,
    useCase
  }
}

describe('deleteInAppDataStorageUseCase()', () => {
  it('should delete an item from the data storage', async () => {
    const key = 'item';
    const val = 'some text data';
    const { useCase, appDataStorage } = setup({ [key]: val });

    await useCase(key);

    expect(await appDataStorage.getText(key)).toBeUndefined();
  });
})
