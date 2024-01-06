/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetMenuItem } from '@/base/widget';
import { makeFixture } from '@utils/makeFixture';

const widgetMenuItems: WidgetMenuItem[] = [{
  label: 'M-A'
}, {
  label: 'M-B'
}, {
  label: 'M-C'
}, {
  label: 'M-D'
}]

export const fixtureWidgetMenuItemA = makeFixture(widgetMenuItems[0]);
export const fixtureWidgetMenuItemB = makeFixture(widgetMenuItems[1]);
export const fixtureWidgetMenuItemC = makeFixture(widgetMenuItems[2]);
export const fixtureWidgetMenuItemD = makeFixture(widgetMenuItems[3]);
