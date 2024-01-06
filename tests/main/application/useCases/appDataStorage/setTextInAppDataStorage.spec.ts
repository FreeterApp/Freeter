/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createSetTextInAppDataStorageUseCase } from '@/application/useCases/appDataStorage/setTextInAppDataStorage';

function setup(initData?: Record<string, string>) {
  const appDataStorage = createInMemoryDataStorage(initData)
  const useCase = createSetTextInAppDataStorageUseCase({
    appDataStorage
  });
  return {
    appDataStorage,
    useCase
  }
}

describe('setTextInAppDataStorageUseCase()', () => {
  it('should set a text data to the data storage', async () => {
    const key = 'item';
    const val = 'some text data';
    const { useCase, appDataStorage } = setup();

    await useCase(key, val);

    expect(await appDataStorage.getText(key)).toBe(val);
  });
})
