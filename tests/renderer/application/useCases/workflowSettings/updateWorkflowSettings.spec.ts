/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createUpdateWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/updateWorkflowSettings';
import { AppState } from '@/base/state/app';
import { fixtureWorkflowA, fixtureWorkflowSettingsA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const updateWorkflowSettingsUseCase = createUpdateWorkflowSettingsUseCase({
    appStore
  });
  return {
    appStore,
    updateWorkflowSettingsUseCase
  }
}

describe('updateWorkflowSettingsUseCase()', () => {
  it('should do nothing, if workflow is null', async () => {
    const newSettings = fixtureWorkflowSettingsA();
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: null
            })
          })
        })
      }
    })
    const {
      appStore,
      updateWorkflowSettingsUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    updateWorkflowSettingsUseCase(newSettings);

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the settings state', async () => {
    const newSettings = fixtureWorkflowSettingsA({
      name: 'New Name'
    });
    const workflow = fixtureWorkflowA()
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow
            })
          })
        })
      }
    })
    const expectState: typeof initState = {
      ...initState,
      ui: {
        ...initState.ui,
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            workflowSettings: {
              ...initState.ui.modalScreens.data.workflowSettings,
              workflow: {
                ...workflow,
                settings: {
                  ...workflow.settings,
                  ...newSettings
                }
              }
            }
          }
        }
      }
    }
    const {
      appStore,
      updateWorkflowSettingsUseCase
    } = await setup(initState)

    updateWorkflowSettingsUseCase(newSettings);

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
