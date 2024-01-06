/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenAboutUseCase } from '@/application/useCases/about/openAbout';
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
  const openAboutUseCase = createOpenAboutUseCase({
    appStore
  });
  return {
    appStore,
    openAboutUseCase
  }
}

describe('openAboutUseCase()', () => {
  it('should set about=true and reset other modals in the app state', async () => {
    const initState = fixtureAppState({
      ui: {
        about: false,
        applicationSettings: fixtureApplicationSettings({ appConfig: fixtureAppConfig() }),
        projectManager: fixtureProjectManager({ currentProjectId: '', deleteProjectIds: {}, projectIds: [], projects: {} }),
        widgetSettings: fixtureWidgetSettings({ widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetA() } }),
        workflowSettings: fixtureWorkflowSettings({ workflow: fixtureWorkflowA() })
      }
    })
    let expectState = modalScreensStateActions.resetAll(initState);
    expectState = {
      ...expectState,
      ui: {
        ...expectState.ui,
        about: true
      }
    }
    const {
      appStore,
      openAboutUseCase
    } = await setup(initState)

    openAboutUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
