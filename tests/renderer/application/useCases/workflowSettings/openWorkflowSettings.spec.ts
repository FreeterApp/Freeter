/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createOpenWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/openWorkflowSettings';
import { AppState } from '@/base/state/app';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const workflowId = 'WORKFLOW-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const openWorkflowSettingsUseCase = createOpenWorkflowSettingsUseCase({
    appStore
  });
  return {
    appStore,
    openWorkflowSettingsUseCase
  }
}

describe('openWorkflowSettingsUseCase()', () => {
  it('should correctly update the state, when the workflow id exists and the screen is not open', async () => {
    const workflow = fixtureWorkflowA({ id: workflowId })
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowId]: workflow
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: null
            })
          }),
          order: ['about']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: fixtureModalScreens({
          ...initState.ui.modalScreens,
          data: fixtureModalScreensData({
            ...initState.ui.modalScreens.data,
            workflowSettings: fixtureWorkflowSettings({
              ...initState.ui.modalScreens.data.workflowSettings,
              workflow
            })
          }),
          order: ['about', 'workflowSettings']
        })
      }
    }
    const {
      appStore,
      openWorkflowSettingsUseCase
    } = await setup(initState)

    openWorkflowSettingsUseCase(workflowId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should correctly update the state, when the workflow id exists and the screen is already open', async () => {
    const workflow = fixtureWorkflowA({ id: workflowId })
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowId]: workflow
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: null
            })
          }),
          order: ['workflowSettings', 'about']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: fixtureModalScreens({
          ...initState.ui.modalScreens,
          data: fixtureModalScreensData({
            ...initState.ui.modalScreens.data,
            workflowSettings: fixtureWorkflowSettings({
              ...initState.ui.modalScreens.data.workflowSettings,
              workflow
            })
          }),
          order: ['about', 'workflowSettings']
        })
      }
    }
    const {
      appStore,
      openWorkflowSettingsUseCase
    } = await setup(initState)

    openWorkflowSettingsUseCase(workflowId);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })

  it('should do nothing, if the workflow id does not exist', async () => {
    const workflow = fixtureWorkflowA({ id: workflowId })
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowId]: workflow
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: null
            })
          }),
          order: ['about']
        })
      }
    })
    const {
      appStore,
      openWorkflowSettingsUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    openWorkflowSettingsUseCase('NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
  })
})
