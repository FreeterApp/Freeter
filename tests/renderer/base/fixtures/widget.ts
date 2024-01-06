/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Widget, WidgetCoreSettings, WidgetEnvAreaShelf, WidgetEnvAreaWorkflow } from '@/base/widget';
import { makeFixture } from '@utils/makeFixture';

export const widgetCoreSettings: WidgetCoreSettings[] = [{
  name: 'Widget A',
}, {
  name: 'Widget B',
}, {
  name: 'Widget C',
}, {
  name: 'Widget D',
}, {
  name: 'Widget E',
}]

export const widgets: Widget[] = [{
  id: 'W-A',
  coreSettings: {
    ...widgetCoreSettings[0]
  },
  settings: {
  },
  type: 'webpage',
}, {
  id: 'W-B',
  coreSettings: {
    ...widgetCoreSettings[1]
  },
  settings: {
  },
  type: 'sometype',
}, {
  id: 'W-C',
  coreSettings: {
    ...widgetCoreSettings[2]
  },
  settings: {
  },
  type: 'sometype',
}, {
  id: 'W-D',
  coreSettings: {
    ...widgetCoreSettings[3]
  },
  settings: {
  },
  type: 'sometype',
}, {
  id: 'W-E',
  coreSettings: {
    ...widgetCoreSettings[4]
  },
  settings: {
  },
  type: 'sometype',
}];

export const widgetEnvAreaShelf: WidgetEnvAreaShelf = {
  area: 'shelf'
}

export const widgetEnvAreaWorkflow: WidgetEnvAreaWorkflow = {
  area: 'workflow',
  projectId: 'P-A',
  workflowId: 'W-A',
}

export const fixtureWidgetA = makeFixture(widgets[0]);
export const fixtureWidgetB = makeFixture(widgets[1]);
export const fixtureWidgetC = makeFixture(widgets[2]);
export const fixtureWidgetD = makeFixture(widgets[3]);
export const fixtureWidgetE = makeFixture(widgets[4]);

export const fixtureWidgetCoreSettingsA = makeFixture(widgetCoreSettings[0]);
export const fixtureWidgetCoreSettingsB = makeFixture(widgetCoreSettings[1]);
export const fixtureWidgetCoreSettingsC = makeFixture(widgetCoreSettings[2]);
export const fixtureWidgetCoreSettingsD = makeFixture(widgetCoreSettings[3]);
export const fixtureWidgetCoreSettingsE = makeFixture(widgetCoreSettings[4]);

export const fixtureWidgetEnvAreaShelf = makeFixture(widgetEnvAreaShelf);
export const fixtureWidgetEnvAreaWorkflow = makeFixture(widgetEnvAreaWorkflow);
