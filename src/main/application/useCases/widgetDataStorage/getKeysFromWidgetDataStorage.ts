/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createGetKeysFromWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function getKeysFromWidgetDataStorageUseCase(widgetId: string): Promise<string[]> {
    return (await widgetDataStorageManager.getObject(widgetId)).getKeys();
  }
}

export type GetKeysFromWidgetDataStorageUseCase = ReturnType<typeof createGetKeysFromWidgetDataStorageUseCase>;
