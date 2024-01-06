/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage } from '@common/application/interfaces/dataStorage';

interface Deps {
  appDataStorage: DataStorage
}

export function createSetTextInAppDataStorageUseCase({ appDataStorage }: Deps) {
  return async function setTextInAppDataStorageUseCase(key: string, text: string): Promise<void> {
    return appDataStorage.setText(key, text);
  }
}

export type SetTextInAppDataStorageUseCase = ReturnType<typeof createSetTextInAppDataStorageUseCase>;
