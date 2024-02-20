/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetSettings, WidgetType } from '@/base/widgetType';
import { WidgetReactComponent } from '@/widgets/appModules';
import { deepFreeze } from '@common/helpers/deepFreeze';

export const widgetTypes: WidgetType[] = [{
  id: 'WP-A',
  icon: 'wp-a',
  name: 'Widget A',
  minSize: {
    w: 1,
    h: 1
  },
  settingsEditorComp: {
    type: 'react',
    Comp: () => <>Settings 1</>
  } as WidgetReactComponent<WidgetSettings>,
  widgetComp: {
    type: 'react',
    Comp: () => <>Widget 1</>
  } as WidgetReactComponent<WidgetSettings>,
  createSettingsState: () => ({}),
  requiresApi: []
}, {
  id: 'WP-B',
  icon: 'wp-b',
  name: 'Widget B',
  minSize: {
    w: 1,
    h: 1
  },
  settingsEditorComp: {
    type: 'react',
    Comp: () => <>Settings 1</>
  } as WidgetReactComponent<WidgetSettings>,
  widgetComp: {
    type: 'react',
    Comp: () => <>Widget 1</>
  } as WidgetReactComponent<WidgetSettings>,
  createSettingsState: () => ({}),
  requiresApi: []
}, {
  id: 'WP-C',
  icon: 'wp-c',
  name: 'Widget C',
  minSize: {
    w: 1,
    h: 1
  },
  settingsEditorComp: {
    type: 'react',
    Comp: () => <>Settings 1</>
  } as WidgetReactComponent<WidgetSettings>,
  widgetComp: {
    type: 'react',
    Comp: () => <>Widget 1</>
  } as WidgetReactComponent<WidgetSettings>,
  createSettingsState: () => ({}),
  requiresApi: []
}, {
  id: 'WP-D',
  icon: 'wp-d',
  name: 'Widget D',
  minSize: {
    w: 1,
    h: 1
  },
  settingsEditorComp: {
    type: 'react',
    Comp: () => <>Settings 1</>
  } as WidgetReactComponent<WidgetSettings>,
  widgetComp: {
    type: 'react',
    Comp: () => <>Widget 1</>
  } as WidgetReactComponent<WidgetSettings>,
  createSettingsState: () => ({}),
  requiresApi: []
}]

type WidgetTypeTestData = Partial<WidgetType>;

const makeWidgetTypeFixture = (
  fixtureData: WidgetType
) => (testData?: WidgetTypeTestData): WidgetType => deepFreeze({
  ...fixtureData,
  ...testData
} as WidgetType);

export const fixtureWidgetTypeA = makeWidgetTypeFixture(widgetTypes[0]);
export const fixtureWidgetTypeB = makeWidgetTypeFixture(widgetTypes[1]);
export const fixtureWidgetTypeC = makeWidgetTypeFixture(widgetTypes[2]);
export const fixtureWidgetTypeD = makeWidgetTypeFixture(widgetTypes[3]);
