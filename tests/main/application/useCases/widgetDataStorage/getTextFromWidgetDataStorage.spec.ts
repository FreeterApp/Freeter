/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createGetTextFromWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/getTextFromWidgetDataStorage';
import { createObjectManager } from '@common/base/objectManager';

function setup() {
  const widgetDataStorageManager = createObjectManager(async () => createInMemoryDataStorage(), async () => true);
  const useCase = createGetTextFromWidgetDataStorageUseCase({
    widgetDataStorageManager
  });
  return {
    widgetDataStorageManager,
    useCase
  }
}

describe('getTextFromWidgetDataStorageUseCase()', () => {
  it('should get a text data from the right widget data storage, when an item exists', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const key = 'item-key';
    const val = 'some text data';
    const { useCase, widgetDataStorageManager } = setup();
    await (await widgetDataStorageManager.getObject(widgetId1)).setText(key, val);
    await (await widgetDataStorageManager.getObject(widgetId2)).setText(key, 'another text');

    const res = await useCase(widgetId1, key);

    expect(res).toBe(val);
  });

  it('should return undefined, when an item does not exist in the widget data storage', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const key1 = 'item-key1';
    const key2 = 'item-key2';
    const val = 'some text data';
    const { useCase, widgetDataStorageManager } = setup();
    await (await widgetDataStorageManager.getObject(widgetId1)).setText(key1, val);
    await (await widgetDataStorageManager.getObject(widgetId2)).setText(key2, 'another text');

    const res = await useCase(widgetId1, key2);

    expect(res).toBeUndefined();
  });
})
