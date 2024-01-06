/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage } from '@common/application/interfaces/dataStorage';

export function setTextOnlyIfChanged<T extends DataStorage>(dataStorage: T): T {
  let prevItems: Record<string, string | undefined> = {};
  return {
    ...dataStorage,
    getText: async (key) => {
      const item = await dataStorage.getText(key);
      prevItems[key] = item;
      return item;
    },
    setText: async (key, text) => {
      if (prevItems[key] !== text) {
        prevItems[key] = text;
        return dataStorage.setText(key, text);
      }
      return undefined;
    },
    deleteItem: async (key) => {
      delete prevItems[key];
      return dataStorage.deleteItem(key);
    },
    clear: async () => {
      prevItems = {};
      return dataStorage.clear();
    }
  }
}
