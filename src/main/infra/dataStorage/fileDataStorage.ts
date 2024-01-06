/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { mkdir, rm, readFile, writeFile, readdir, stat, unlink } from 'node:fs/promises';
import { join, normalize } from 'node:path';

import { DataStorage } from '@common/application/interfaces/dataStorage';

async function getAllKeys(normStorageDirPath: string) {
  try {
    const items = await readdir(normStorageDirPath);
    return (await Promise.all(items.map(async item => {
      const filePath = join(normStorageDirPath, item);
      if ((await stat(filePath)).isFile()) {
        return item;
      } else {
        return '';
      }
    }))).filter(item => !!item);
  } catch {
    return undefined;
  }
}
async function clearStorage(normStorageDirPath: string) {
  let items: string[];
  try {
    items = await readdir(normStorageDirPath);
  } catch (e) {
    return undefined;
  }

  if (items) {
    await Promise.all(items.map(async item => {
      const filePath = join(normStorageDirPath, item);
      if ((await stat(filePath)).isFile()) {
        await unlink(filePath);
      }
    }))
  }

  return undefined;
}

function storageKeyToFilePath(normStorageDirPath: string, key: string): string | undefined {
  if (!key) {
    return undefined;
  }
  return join(normStorageDirPath, key.replace(/[^A-Za-z0-9_\-()\s]/g, '_'));
}

export async function createFileDataStorage(dataType: 'string', storageDirPath: string): Promise<DataStorage> {
  const normStorageDirPath = normalize(storageDirPath);
  try {
    await mkdir(normStorageDirPath, { recursive: true });
  } catch (err) {
    // TODO: handle err
  }
  return {
    deleteItem: async (key) => {
      const filePath = storageKeyToFilePath(normStorageDirPath, key);
      if (filePath) {
        rm(filePath)
      }
    },
    getText: async (key) => {
      try {
        const filePath = storageKeyToFilePath(normStorageDirPath, key);
        if (filePath) {
          return await readFile(filePath, { encoding: 'utf-8' })
        } else {
          return undefined;
        }
      } catch {
        return undefined;
      }
    },
    setText: async (key, data) => {
      try {
        const filePath = storageKeyToFilePath(normStorageDirPath, key);
        if (filePath) {
          return await writeFile(join(normStorageDirPath, key), data, { encoding: 'utf-8' })
        } else {
          return undefined;
        }
      } catch {
        return undefined;
      }
    },
    clear: async () => await clearStorage(normStorageDirPath),
    getKeys: async () => (await getAllKeys(normStorageDirPath) || [])
  }
}
