/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenApplicationSettingsUseCase } from '@/application/useCases/applicationSettings/openApplicationSettings';
import { modalScreensStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openApplicationSettingsUseCase = createOpenApplicationSettingsUseCase({
    appStore
  });
  return {
    appStore,
    openApplicationSettingsUseCase
  }
}

describe('openApplicationSettingsUseCase()', () => {
  it('should set appConfig to the application settings and reset other modals in the app state', async () => {
    const appConfig = fixtureAppConfig({ mainHotkey: 'Accelerator' });
    const initState = fixtureAppState({
      ui: {
        appConfig,
        applicationSettings: fixtureApplicationSettings({
          appConfig: null
        }),

        about: false,
        projectManager: fixtureProjectManager({ currentProjectId: '', deleteProjectIds: {}, projectIds: [], projects: {} }),
        widgetSettings: fixtureWidgetSettings({ widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetA() } }),
        workflowSettings: fixtureWorkflowSettings({ workflow: fixtureWorkflowA() }),
      }
    })
    let expectState = modalScreensStateActions.resetAll(initState);
    expectState = {
      ...expectState,
      ui: {
        ...expectState.ui,
        applicationSettings: {
          ...expectState.ui.applicationSettings,
          appConfig
        }
      }
    }
    const {
      appStore,
      openApplicationSettingsUseCase
    } = await setup(initState)

    openApplicationSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
