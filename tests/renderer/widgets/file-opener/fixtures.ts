/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/file-opener/settings';
import { SettingsType } from '@/widgets/file-opener/settingsType';

export function fixtureSettings(settings: Partial<Settings>): Settings {
  return {
    openIn: '',
    files: ['file/path1', 'file/path2'],
    folders: ['folder/path1', 'folder/path2'],
    type: SettingsType.File,
    ...settings
  }
}
