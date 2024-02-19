/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessInfoOsName } from '@common/base/process';
import { spawnSync } from 'node:child_process';

export function detectDefaultTerminal(): string {
  let defTerm = '';

  switch (process.platform as ProcessInfoOsName) {
    case 'linux': {
      for (const terminal of ['gnome-terminal', 'konsole', 'x-terminal-emulator']) {
        const check = spawnSync('which', [terminal]);
        if (check.status === 0) {
          defTerm = terminal;
          break;
        }
      }
      if (defTerm === '') {
        defTerm = 'xterm';
      }
      break;
    }
    case 'darwin': {
      defTerm = 'Terminal.app';
      break;
    }
    case 'win32': {
      defTerm = process.env.ComSpec || 'cmd.exe';
      break;
    }
  }

  return defTerm;
}
