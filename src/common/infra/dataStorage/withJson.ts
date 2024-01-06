/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage as DataStorageCommon, DataStorageJson } from '@common/application/interfaces/dataStorage';

export function withJson<T extends DataStorageCommon>(dataStorage: T): T & DataStorageJson {
  return {
    ...dataStorage,
    getJson: async (key) => {
      const stringItem = await dataStorage.getText(key);
      if (stringItem !== undefined) {
        try {
          return JSON.parse(stringItem)
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    setJson: async (key, val) => dataStorage.setText(key, JSON.stringify(val))
  }
}
