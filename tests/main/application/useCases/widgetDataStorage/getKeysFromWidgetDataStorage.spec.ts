/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createGetKeysFromWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/getKeysFromWidgetDataStorage';
import { createObjectManager } from '@common/base/objectManager';

function setup() {
  const widgetDataStorageManager = createObjectManager(async () => createInMemoryDataStorage(), async () => true);
  const useCase = createGetKeysFromWidgetDataStorageUseCase({
    widgetDataStorageManager
  });
  return {
    widgetDataStorageManager,
    useCase
  }
}

describe('getKeysFromWidgetDataStorageUseCase()', () => {
  it('should get keys from the right widget data storage', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const key1 = 'item-key1';
    const key2 = 'item-key2';
    const { useCase, widgetDataStorageManager } = setup();
    const widget1Storage = await widgetDataStorageManager.getObject(widgetId1);
    const widget2Storage = await widgetDataStorageManager.getObject(widgetId2);
    await widget1Storage.setText(key1, '');
    await widget1Storage.setText(key2, '');
    await widget2Storage.setText(key1, '');

    const res = await useCase(widgetId1);

    expect(res).toEqual([key1, key2]);
  });
})
