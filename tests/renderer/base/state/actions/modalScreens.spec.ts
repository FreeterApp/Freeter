/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { modalScreensStateActions } from '@/base/state/actions';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';

const emptyModalScreensState = fixtureAppState({
  ui: {
    about: false,
    applicationSettings: { appConfig: null },
    projectManager: { currentProjectId: '', deleteProjectIds: null, projectIds: null, projects: null },
    widgetSettings: { widgetInEnv: null },
    workflowSettings: { workflow: null }
  }
})

describe('resetAll', () => {
  it('should do nothing, when all modal screen states are empty', () => {
    const initState = emptyModalScreensState;

    const stateAfterReset = modalScreensStateActions.resetAll(initState);

    expect(stateAfterReset).toBe(initState);
  })

  it('should reset all modal screens, when there are non-empty modal screen states', () => {
    const initState1 = fixtureAppState({
      ui: {
        about: true
      }
    })
    const initState2 = fixtureAppState({
      ui: {
        applicationSettings: fixtureApplicationSettings({ appConfig: fixtureAppConfig() })
      }
    })
    const initState3 = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({ projectIds: [], projects: {}, deleteProjectIds: {} })
      }
    })
    const initState4 = fixtureAppState({
      ui: {
        widgetSettings: fixtureWidgetSettings({ widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetA() } })
      }
    })
    const initState5 = fixtureAppState({
      ui: {
        workflowSettings: fixtureWorkflowSettings({ workflow: fixtureWorkflowA() })
      }
    })
    const expectState = emptyModalScreensState;

    const state1AfterReset = modalScreensStateActions.resetAll(initState1);
    const state2AfterReset = modalScreensStateActions.resetAll(initState2);
    const state3AfterReset = modalScreensStateActions.resetAll(initState3);
    const state4AfterReset = modalScreensStateActions.resetAll(initState4);
    const state5AfterReset = modalScreensStateActions.resetAll(initState5);

    expect(state1AfterReset).toEqual(expectState);
    expect(state2AfterReset).toEqual(expectState);
    expect(state3AfterReset).toEqual(expectState);
    expect(state4AfterReset).toEqual(expectState);
    expect(state5AfterReset).toEqual(expectState);
  })
})
