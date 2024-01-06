/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ObjectManager } from '@common/base/objectManager';

export interface DataStorage {
  getText(key: string): Promise<string | undefined>;
  setText(key: string, text: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getKeys(): Promise<string[]>;
}

export type DataStorageManager = ObjectManager<DataStorage>;

export interface DataStorageJson {
  getJson(key: string): Promise<unknown>;
  setJson(key: string, json: unknown): Promise<void>;
}
