/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaverWorkflowA, fixtureMemSaverWorkflowB } from '@tests/base/fixtures/memSaver';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { deactivateWorkflowSubCase } from '@/application/useCases/memSaver/subs/deactivateWorkflow';

jest.useFakeTimers();

describe('deactivateWorkflowSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should remove the specified workflow from active workflows', () => {
    const itemA = fixtureMemSaverWorkflowA();
    const itemB = fixtureMemSaverWorkflowB({ wflId: 'WFL-1' });
    const state = fixtureMemSaver({
      activeWorkflows: [itemA, itemB]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [itemA]
    }

    const newState = deactivateWorkflowSubCase(
      'WFL-1',
      state
    )

    expect(newState).toEqual(expectState)
  })

  it('should remove the deactivation timeout for the specified workflow', () => {
    jest.spyOn(global, 'clearTimeout');
    const state = fixtureMemSaver({
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
        'WFL-2': 2 as unknown as NodeJS.Timeout,
      }
    })
    const expectState: MemSaverState = {
      ...state,
      workflowTimeouts: {
        'WFL-2': 2 as unknown as NodeJS.Timeout,
      }
    }

    const newState = deactivateWorkflowSubCase(
      'WFL-1',
      state
    )

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenNthCalledWith(1, 1);
    expect(newState).toEqual(expectState)
  })
})
