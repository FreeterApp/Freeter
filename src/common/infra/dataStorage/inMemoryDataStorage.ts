/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage } from '@common/application/interfaces/dataStorage';

export function createInMemoryDataStorage(initData?: Record<string, string>): DataStorage {
  let storage = { ...initData };
  return {
    getText: async (key) => storage[key] as string ?? undefined,
    setText: async (key, item) => { storage[key] = item },
    deleteItem: async (key) => { delete storage[key] },
    clear: async () => { storage = {} },
    getKeys: async () => Object.keys(storage)
  }
}
