/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { ShellProvider } from '@/application/interfaces/shellProvider';

export function createShellProvider(): ShellProvider {
  return {
    openExternal: async (url) => Electron.shell.openExternal(url)
  }
}
