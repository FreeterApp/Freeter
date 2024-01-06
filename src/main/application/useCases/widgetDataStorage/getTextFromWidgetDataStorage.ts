/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createGetTextFromWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function getTextFromWidgetDataStorageUseCase(widgetId: string, key: string): Promise<string | undefined> {
    return (await widgetDataStorageManager.getObject(widgetId)).getText(key);
  }
}

export type GetTextFromWidgetDataStorageUseCase = ReturnType<typeof createGetTextFromWidgetDataStorageUseCase>;
