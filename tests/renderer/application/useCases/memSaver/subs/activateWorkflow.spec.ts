/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaverWorkflowA } from '@tests/base/fixtures/memSaver';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { activateWorkflowSubCase } from '@/application/useCases/memSaver/subs/activateWorkflow';

jest.useFakeTimers();

describe('activateWorkflowSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should add the specified workflow to active workflows', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA()]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-1', wflId: 'WFL-1' }]
    }

    const newState = activateWorkflowSubCase(
      'PRJ-1',
      'WFL-1',
      state
    )

    expect(newState).toEqual(expectState)
  })

  it('should not add the specified workflow to active workflows, when it already exists', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA({ wflId: 'WFL-1' })]
    })

    const newState = activateWorkflowSubCase(
      'PRJ-1',
      'WFL-1',
      state
    )

    expect(newState).toBe(state)
  })

  it('should remove the deactivation timeout for the specified workflow', () => {
    jest.spyOn(global, 'clearTimeout');
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA({ wflId: 'WFL-1' })],
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

    const newState = activateWorkflowSubCase(
      'PRJ-1',
      'WFL-1',
      state
    )

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenNthCalledWith(1, 1);
    expect(newState).toEqual(expectState)
  })
})
