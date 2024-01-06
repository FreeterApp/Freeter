/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetListItem } from '@/base/widgetList';
import { makeFixture } from '@utils/makeFixture';

const widgetList: WidgetListItem[] = [{
  id: 'WL-A',
  widgetId: 'W-A'
}, {
  id: 'WL-B',
  widgetId: 'W-B'
}, {
  id: 'WL-C',
  widgetId: 'W-C'
}, {
  id: 'WL-D',
  widgetId: 'W-D'
}]

export const fixtureWidgetListItemA = makeFixture(widgetList[0]);
export const fixtureWidgetListItemB = makeFixture(widgetList[1]);
export const fixtureWidgetListItemC = makeFixture(widgetList[2]);
export const fixtureWidgetListItemD = makeFixture(widgetList[3]);
