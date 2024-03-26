/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createSetTextInWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/setTextInWidgetDataStorage';
import { createObjectManager } from '@common/base/objectManager';

function setup() {
  const widgetDataStorageManager = createObjectManager(async () => createInMemoryDataStorage(), async () => true);
  const useCase = createSetTextInWidgetDataStorageUseCase({
    widgetDataStorageManager
  });
  return {
    widgetDataStorageManager,
    useCase
  }
}

describe('setTextInWidgetDataStorageUseCase()', () => {
  it('should set a text data to the right widget data storage', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const key1 = 'key1';
    const key2 = 'key2';
    const val1 = 'some text data 1';
    const val2 = 'some text data 2';
    const { useCase, widgetDataStorageManager } = setup();

    await useCase(widgetId1, key1, val1);
    await useCase(widgetId2, key2, val2);

    expect(await (await widgetDataStorageManager.getObject(widgetId1)).getText(key1)).toBe(val1);
    expect(await (await widgetDataStorageManager.getObject(widgetId2)).getText(key2)).toBe(val2);
  });
})
