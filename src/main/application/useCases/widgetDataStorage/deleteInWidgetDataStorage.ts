/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createDeleteInWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function deleteInWidgetDataStorageUseCase(widgetId: string, key: string): Promise<void> {
    return (await widgetDataStorageManager.getObject(widgetId)).deleteItem(key);
  }
}

export type DeleteInWidgetDataStorageUseCase = ReturnType<typeof createDeleteInWidgetDataStorageUseCase>;
