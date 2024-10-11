/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { fixtureMemSaverWorkflowA, fixtureMemSaverWorkflowB } from '@tests/base/fixtures/memSaver';
import { startDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/startDelayedWorkflowDeactivation';

jest.useFakeTimers();

describe('startDelayedWorkflowDeactivationSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should do nothing for workflows already having a timeout running', () => {
    jest.spyOn(global, 'setTimeout');
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
      ],
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
      }
    })

    const newState = startDelayedWorkflowDeactivationSubCase(
      'WFL-1',
      () => { },
      5000,
      state
    )

    expect(newState).toBe(state)
    expect(setTimeout).not.toHaveBeenCalled();
  })

  it('should start a delayed deactivation for workflows not having a timeout running', () => {
    jest.spyOn(global, 'setTimeout');
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
      ],
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
      }
    })
    const expectState = {
      ...state,
      workflowTimeouts: {
        ...state.workflowTimeouts,
        'WFL-2': expect.any(Number)
      }
    }
    const mockDeactivateWorkflowUseCase = jest.fn();

    const newState = startDelayedWorkflowDeactivationSubCase(
      'WFL-2',
      mockDeactivateWorkflowUseCase,
      5,
      state
    )

    expect(newState).toEqual(expectState)
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 5 * 60000);

    jest.runOnlyPendingTimers();

    expect(mockDeactivateWorkflowUseCase).toHaveBeenCalledTimes(1);
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(1, 'WFL-2');
  })
})
