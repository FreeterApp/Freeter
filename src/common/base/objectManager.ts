/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface ObjectManager<T> {
  getObject(id: string): Promise<T>;
  copyObjectData(fromId: string, toId: string): Promise<boolean>;
}

export function createObjectManager<T>(
  objectFactory: (id: string) => Promise<T>,
  objectDataCopier: (fromId: string, toId: string) => Promise<boolean>
): ObjectManager<T> {
  const items: Record<string, Promise<T>> = {};

  return {
    getObject: async (id) => {
      if (!items[id]) {
        items[id] = objectFactory(id);
      }
      return items[id];
    },
    copyObjectData: objectDataCopier
  }
}
