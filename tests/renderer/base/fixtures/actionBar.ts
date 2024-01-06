/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItem } from '@/base/actionBar';
import { makeFixture } from '@utils/makeFixture';

export const actionBarItems: ActionBarItem[] = [{
  id: 'WA-A',
  doAction: async () => undefined,
  enabled: true,
  icon: 'A',
  title: 'title A'
}, {
  id: 'WA-B',
  doAction: async () => undefined,
  enabled: true,
  icon: 'B',
  title: 'title B'
}, {
  id: 'WA-C',
  doAction: async () => undefined,
  enabled: true,
  icon: 'C',
  title: 'title C'
}, {
  id: 'WA-D',
  doAction: async () => undefined,
  enabled: true,
  icon: 'D',
  title: 'title D'
}]

export const fixtureActionBarItemA = makeFixture(actionBarItems[0]);
export const fixtureActionBarItemB = makeFixture(actionBarItems[1]);
export const fixtureActionBarItemC = makeFixture(actionBarItems[2]);
export const fixtureActionBarItemD = makeFixture(actionBarItems[3]);
