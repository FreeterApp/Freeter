/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage } from '@common/application/interfaces/dataStorage';

interface Deps {
  appDataStorage: DataStorage
}

export function createDeleteInAppDataStorageUseCase({ appDataStorage }: Deps) {
  return async function deleteInAppDataStorageUseCase(key: string): Promise<void> {
    return appDataStorage.deleteItem(key);
  }
}

export type DeleteInAppDataStorageUseCase = ReturnType<typeof createDeleteInAppDataStorageUseCase>;
