/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DataStorage, DataStorageJson } from '@common/application/interfaces/dataStorage';
import { ObjectManager } from '@common/base/objectManager';

export interface DataStorageRenderer extends DataStorage, DataStorageJson { }

export type DataStorageManagerRenderer = ObjectManager<DataStorageRenderer>;
