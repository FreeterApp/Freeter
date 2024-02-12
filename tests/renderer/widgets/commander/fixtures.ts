/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/commander/settings';

export function fixtureSettings(settings: Partial<Settings>): Settings {
  return {
    cmds: ['test-cmd1', 'test-cmd2'],
    cwd: 'test/dir',
    ...settings
  }
}
