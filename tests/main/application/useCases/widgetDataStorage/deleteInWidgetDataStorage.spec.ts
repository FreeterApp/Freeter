/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { createDeleteInWidgetDataStorageUseCase } from '@/application/useCases/widgetDataStorage/deleteInWidgetDataStorage';
import { createObjectManager } from '@common/base/objectManager';

function setup() {
  const widgetDataStorageManager = createObjectManager(async () => createInMemoryDataStorage());
  const useCase = createDeleteInWidgetDataStorageUseCase({
    widgetDataStorageManager
  });
  return {
    widgetDataStorageManager,
    useCase
  }
}

describe('deleteInWidgetDataStorageUseCase()', () => {
  it('should delete an item from the right widget data storage', async () => {
    const widgetId1 = 'widget-id1';
    const widgetId2 = 'widget-id2';
    const key = 'item-key';
    const val = 'some text data';
    const { useCase, widgetDataStorageManager } = setup();
    const widget1Storage = await widgetDataStorageManager.getObject(widgetId1);
    const widget2Storage = await widgetDataStorageManager.getObject(widgetId2);
    await widget1Storage.setText(key, val);
    await widget2Storage.setText(key, val);

    await useCase(widgetId1, key);

    expect(await widget1Storage.getText(key)).toBeUndefined();
    expect(await widget2Storage.getText(key)).toBe(val);
  });
})
