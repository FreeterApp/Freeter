/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createClearWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/clearWidgetDataStorage';
import { createObjectManager } from '@common/base/objectManager';

function setup() {
  const widgetDataStorageManager = createObjectManager(async () => createInMemoryDataStorage(), async () => true);
  const useCase = createClearWidgetDataStorageUseCase({
    widgetDataStorageManager
  });
  return {
    widgetDataStorageManager,
    useCase
  }
}

describe('clearWidgetDataStorageUseCase()', () => {
  it('should clear the right widget data storage', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const { useCase, widgetDataStorageManager } = setup();
    await (await widgetDataStorageManager.getObject(widgetId1)).setText('key1', 'val1');
    await (await widgetDataStorageManager.getObject(widgetId1)).setText('key2', 'val2');
    await (await widgetDataStorageManager.getObject(widgetId2)).setText('key3', 'val3');
    await (await widgetDataStorageManager.getObject(widgetId2)).setText('key4', 'val4');

    await useCase(widgetId1);

    expect(await (await widgetDataStorageManager.getObject(widgetId1)).getKeys()).toEqual([]);
    expect(await (await widgetDataStorageManager.getObject(widgetId2)).getKeys()).toEqual(['key3', 'key4']);
  });
})
