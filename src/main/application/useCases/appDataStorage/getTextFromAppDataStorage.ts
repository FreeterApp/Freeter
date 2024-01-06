/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage } from '@common/application/interfaces/dataStorage';

interface Deps {
  appDataStorage: DataStorage
}

export function createGetTextFromAppDataStorageUseCase({ appDataStorage }: Deps) {
  return async function getTextFromAppDataStorageUseCase(key: string): Promise<string | undefined> {
    return appDataStorage.getText(key);
  }
}

export type GetTextFromAppDataStorageUseCase = ReturnType<typeof createGetTextFromAppDataStorageUseCase>;
