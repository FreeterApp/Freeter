/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorageManager } from '@common/application/interfaces/dataStorage';

interface Deps {
  widgetDataStorageManager: DataStorageManager
}

export function createCopyWidgetDataStorageUseCase({ widgetDataStorageManager }: Deps) {
  return async function copyWidgetDataStorageUseCase(srcWidgetId: string, destWidgetId: string): Promise<boolean> {
    return widgetDataStorageManager.copyObjectData(srcWidgetId, destWidgetId);
  }
}

export type CopyWidgetDataStorageUseCase = ReturnType<typeof createCopyWidgetDataStorageUseCase>;
