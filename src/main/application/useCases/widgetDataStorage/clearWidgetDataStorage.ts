/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createClearWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function clearWidgetDataStorageUseCase(widgetId: string): Promise<void> {
    return (await widgetDataStorageManager.getObject(widgetId)).clear();
  }
}

export type ClearWidgetDataStorageUseCase = ReturnType<typeof createClearWidgetDataStorageUseCase>;
