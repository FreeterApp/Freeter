/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloseWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/closeWorkflowSettings';
import { AppState } from '@/base/state/app';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const closeWorkflowSettingsUseCase = createCloseWorkflowSettingsUseCase({
    appStore
  });
  return {
    appStore,
    closeWorkflowSettingsUseCase
  }
}

describe('closeWorkflowSettingsUseCase()', () => {
  it('should remove widgetInEnv from the state', async () => {
    const initState = fixtureAppState({
      ui: {
        workflowSettings: fixtureWorkflowSettings({
          workflow: fixtureWorkflowA()
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        workflowSettings: {
          ...initState.ui.workflowSettings,
          workflow: null
        }
      }
    }
    const {
      appStore,
      closeWorkflowSettingsUseCase
    } = await setup(initState)

    closeWorkflowSettingsUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  })
})
