/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaverWorkflowA, fixtureMemSaverWorkflowB } from '@tests/base/fixtures/memSaver';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { createDeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';

jest.useFakeTimers();

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const deactivateWorkflowUseCase = createDeactivateWorkflowUseCase({
    appStore,
  });
  return {
    appStore,
    deactivateWorkflowUseCase
  }
}

describe('deactivateWorkflowUseCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should remove the specified workflow from active workflows', async () => {
    const itemA = fixtureMemSaverWorkflowA();
    const itemB = fixtureMemSaverWorkflowB({ wflId: 'WFL-1' });
    const initState = fixtureAppState({
      ui: {
        memSaver: fixtureMemSaver({
          activeWorkflows: [itemA, itemB]
        })
      }
    })
    const {
      appStore,
      deactivateWorkflowUseCase
    } = await setup(initState)

    const expectState = {
      ...initState,
      ui: {
        ...initState.ui,
        memSaver: {
          ...initState.ui.memSaver,
          activeWorkflows: [itemA]
        }
      }
    }

    deactivateWorkflowUseCase('WFL-1');

    const newState = appStore.get();
    expect(newState).toEqual(expectState)
  })

  it('should remove the deactivation timeout for the specified workflow', async () => {
    jest.spyOn(global, 'clearTimeout');
    const initState = fixtureAppState({
      ui: {
        memSaver: fixtureMemSaver({
          workflowTimeouts: {
            'WFL-1': 1 as unknown as NodeJS.Timeout,
            'WFL-2': 2 as unknown as NodeJS.Timeout,
          }
        })
      }
    })
    const {
      appStore,
      deactivateWorkflowUseCase
    } = await setup(initState)

    const expectState = {
      ...initState,
      ui: {
        ...initState.ui,
        memSaver: {
          ...initState.ui.memSaver,
          workflowTimeouts: {
            'WFL-2': 2 as unknown as NodeJS.Timeout,
          }
        }
      }
    }

    deactivateWorkflowUseCase('WFL-1');

    const newState = appStore.get();
    expect(newState).toEqual(expectState)
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenNthCalledWith(1, 1);
  })
})
