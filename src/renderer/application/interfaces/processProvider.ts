/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessInfo } from '@common/base/process';

export interface ProcessProvider {
  getProcessInfo: () => ProcessInfo;
}
