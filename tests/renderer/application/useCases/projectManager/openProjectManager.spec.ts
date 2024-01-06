/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenProjectManagerUseCase } from '@/application/useCases/projectManager/openProjectManager';
import { modalScreensStateActions } from '@/base/state/actions';
import { AppState } from '@/base/state/app';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC } from '@tests/base/fixtures/project';
import { fixtureWidgetA, fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureApplicationSettings } from '@tests/base/state/fixtures/applicationSettings';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureWidgetSettings } from '@tests/base/state/fixtures/widgetSettings';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const projectId1 = 'PROJECT-ID-1';
const projectId2 = 'PROJECT-ID-2';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openProjectManagerUseCase = createOpenProjectManagerUseCase({
    appStore
  });
  return {
    appStore,
    openProjectManagerUseCase
  }
}

describe('openProjectManagerUseCase()', () => {
  it('should init the deletion array state and set the projects to the Project Manager state using the project list of the Project Switcher state, and reset other modal screens state', async () => {
    const projectA = fixtureProjectA({ id: projectId1 });
    const projectB = fixtureProjectB({ id: projectId2 })
    const projectC = fixtureProjectC();
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
          [projectC.id]: projectC
        }
      },
      ui: {
        projectManager: fixtureProjectManager({
          currentProjectId: '',
          deleteProjectIds: null,
          projects: null
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId2,
          projectIds: [projectId2, projectId1]
        }),

        about: false,
        applicationSettings: fixtureApplicationSettings({ appConfig: fixtureAppConfig() }),
        widgetSettings: fixtureWidgetSettings({ widgetInEnv: { env: fixtureWidgetEnvAreaShelf(), widget: fixtureWidgetA() } }),
        workflowSettings: fixtureWorkflowSettings({ workflow: fixtureWorkflowA() })
      }
    })
    let expectState = modalScreensStateActions.resetAll(initState);
    expectState = {
      ...expectState,
      ui: {
        ...expectState.ui,
        projectManager: {
          currentProjectId: projectId2,
          deleteProjectIds: {},
          projects: {
            [projectA.id]: projectA,
            [projectB.id]: projectB,
            [projectC.id]: projectC
          },
          projectIds: [projectId2, projectId1]
        }
      }
    }
    const {
      appStore,
      openProjectManagerUseCase
    } = await setup(initState)

    openProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

})
