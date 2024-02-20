/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppsProvider } from '@/application/interfaces/appsProvider';
import { detectDefaultTerminal } from '@/infra/appsProvider/detectDefaultTerminal';

export function createAppsProvider(): AppsProvider {
  const defaultTerminal = detectDefaultTerminal();
  return {
    getDefaultTerminal: () => defaultTerminal
  }
}
