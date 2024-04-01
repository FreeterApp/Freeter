/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/webpage/settings';

export function fixtureSettings(settings: Partial<Settings>): Settings {
  return {
    sessionPersist: 'persist',
    sessionScope: 'prj',
    url: 'https://some.url/',
    viewMode: 'mobile',
    autoReload: 0,
    ...settings
  }
}
