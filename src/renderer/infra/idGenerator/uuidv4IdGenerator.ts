/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '@/application/interfaces/idGenerator';

export const uuidv4IdGenerator: IdGenerator = (): string => uuidv4();
