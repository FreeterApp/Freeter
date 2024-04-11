/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Settings } from '@/widgets/timer/settings';

export function fixtureSettings(settings: Partial<Settings>): Settings {
  return {
    mins: 25,
    endDesktop: true,
    endSound: 1,
    endSoundVol: 80,
    tickSound: 1,
    tickSoundVol: 80,
    ...settings
  }
}
