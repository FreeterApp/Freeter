/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createSetTextInWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function setTextInWidgetDataStorageUseCase(widgetId: string, key: string, text: string): Promise<void> {
    return (await widgetDataStorageManager.getObject(widgetId)).setText(key, text);
  }
}

export type SetTextInWidgetDataStorageUseCase = ReturnType<typeof createSetTextInWidgetDataStorageUseCase>;
