/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ModalScreensDataState, ModalScreensState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';

const modalScreensDataState: ModalScreensDataState = {
  appManager: fixtureAppManager(),
  applicationSettings: fixtureApplicationSettings(),
  projectManager: fixtureProjectManager(),
  widgetSettings: fixtureWidgetSettings(),
  workflowSettings: fixtureWorkflowSettings(),
}

const modalScreensState: ModalScreensState = {
  data: modalScreensDataState,
  order: []
}

export const fixtureModalScreensData = (testData?: Partial<ModalScreensDataState>): ModalScreensDataState => deepFreeze({
  ...modalScreensDataState,
  ...testData
})

export const fixtureModalScreens = (testData?: Partial<ModalScreensState>): ModalScreensState => deepFreeze({
  ...modalScreensState,
  ...testData
})
