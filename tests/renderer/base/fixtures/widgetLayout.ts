/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetLayoutItem } from '@/base/widgetLayout';
import { deepFreeze } from '@common/helpers/deepFreeze';

const widgetLayout: WidgetLayoutItem[] = [{
  id: 'L-A',
  widgetId: 'W-A',
  rect: {
    x: 3,
    y: 1,
    w: 3,
    h: 2
  }
}, {
  id: 'L-B',
  widgetId: 'W-B',
  rect: {
    x: 0,
    y: 0,
    w: 2,
    h: 3
  }
}, {
  id: 'L-C',
  widgetId: 'W-C',
  rect: {
    x: 2,
    y: 4,
    w: 4,
    h: 14
  }
}, {
  id: 'L-D',
  widgetId: 'W-D',
  rect: {
    x: 3,
    y: 0,
    w: 3,
    h: 1
  }
}, {
  id: 'L-E',
  widgetId: 'W-E',
  rect: {
    x: 0,
    y: 20,
    w: 1,
    h: 1
  }
}]

interface WidgetLayoutItemTestData extends Partial<Omit<WidgetLayoutItem, 'rect'>> {
  rect?: Partial<WidgetLayoutItem['rect']>;
}

const makeWidgetLayoutItemFixture = (fixtureData: WidgetLayoutItem) => (testData?: WidgetLayoutItemTestData): WidgetLayoutItem => deepFreeze({
  ...fixtureData,
  ...testData,
  rect: {
    ...fixtureData.rect,
    ...testData?.rect,
  }
} as WidgetLayoutItem);

export const fixtureWidgetLayoutItemA = makeWidgetLayoutItemFixture(widgetLayout[0]);
export const fixtureWidgetLayoutItemB = makeWidgetLayoutItemFixture(widgetLayout[1]);
export const fixtureWidgetLayoutItemC = makeWidgetLayoutItemFixture(widgetLayout[2]);
export const fixtureWidgetLayoutItemD = makeWidgetLayoutItemFixture(widgetLayout[3]);
export const fixtureWidgetLayoutItemE = makeWidgetLayoutItemFixture(widgetLayout[4]);

