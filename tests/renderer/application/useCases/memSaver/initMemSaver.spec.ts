/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaverConfigApp } from '@tests/base/fixtures/memSaver';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { createInitMemSaverUseCase } from '@/application/useCases/memSaver/initMemSaver';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureAppConfig } from '@tests/base/fixtures/appConfig';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const deactivateWorkflowUseCase = jest.fn();
  const initMemSaverUseCase = createInitMemSaverUseCase({
    appStore,
    deactivateWorkflowUseCase
  });
  return {
    appStore,
    initMemSaverUseCase
  }
}

describe('initMemSaverUseCase()', () => {
  it('should do nothing, if the current project is not set', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl()
        }
      },
      ui: {
        appConfig: fixtureAppConfig({
          memSaver: fixtureMemSaverConfigApp({
            activateWorkflowsOnProjectSwitch: true,
            workflowInactiveAfter: 5
          })
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: ''
        })
      }
    })
    const {
      appStore,
      initMemSaverUseCase
    } = await setup(initState)

    initMemSaverUseCase();

    const newState = appStore.get();
    expect(newState).toBe(initState)
  })

  it('should do nothing, if the current project does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl()
        }
      },
      ui: {
        appConfig: fixtureAppConfig({
          memSaver: fixtureMemSaverConfigApp({
            activateWorkflowsOnProjectSwitch: true,
            workflowInactiveAfter: 5
          })
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: 'NO-SUCH-ID'
        })
      }
    })
    const {
      appStore,
      initMemSaverUseCase
    } = await setup(initState)

    initMemSaverUseCase();

    const newState = appStore.get();
    expect(newState).toBe(initState)
  })

  it('should activate project workflows, if the current project exists', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-ID', workflowIds: ['WFL-1', 'WFL-2'], currentWorkflowId: 'WFL-1' })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: 'WFL-1' }),
          ...fixtureWorkflowBInColl({ id: 'WFL-2' }),
        }
      },
      ui: {
        appConfig: fixtureAppConfig({
          memSaver: fixtureMemSaverConfigApp({
            activateWorkflowsOnProjectSwitch: true,
            workflowInactiveAfter: 5
          })
        }),
        memSaver: fixtureMemSaver({
          activeWorkflows: [],
          workflowTimeouts: {}
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: 'PRJ-ID'
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        memSaver: {
          ...initState.ui.memSaver,
          activeWorkflows: [
            { prjId: 'PRJ-ID', wflId: 'WFL-1' },
            { prjId: 'PRJ-ID', wflId: 'WFL-2' },
          ],
          workflowTimeouts: {
            'WFL-2': expect.any(Number)
          }
        }
      }
    }
    const {
      appStore,
      initMemSaverUseCase
    } = await setup(initState)

    initMemSaverUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState)
  })
})
