/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { fixtureMemSaverConfigApp, fixtureMemSaverWorkflowA, fixtureMemSaverWorkflowB } from '@tests/base/fixtures/memSaver';
import { scheduleWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/scheduleWorkflowDeactivation';

jest.useFakeTimers();

describe('scheduleWorkflowDeactivationSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should deactivate workflows with workflowInactiveAfter == 0', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
      ],
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
        'WFL-2': 2 as unknown as NodeJS.Timeout,
      }
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
      ],
      workflowTimeouts: {
        'WFL-2': 2 as unknown as NodeJS.Timeout,
      }
    }

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-1',
      state,
      fixtureMemSaverConfigApp(),
      {},
      { workflowInactiveAfter: 0 },
      () => { }
    )

    expect(newState).toEqual(expectState)
  })

  it('should setup delayed deactivation for workflows with workflowInactiveAfter > 0 and not already having a timeout running', () => {
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
    const expectState: MemSaverState = {
      ...state,
      workflowTimeouts: {
        ...state.workflowTimeouts,
        'WFL-2': expect.any(Number),
      }
    }
    const mockDeactivateWorkflowUseCase = jest.fn();

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-2',
      state,
      fixtureMemSaverConfigApp(),
      {},
      { workflowInactiveAfter: 5 },
      mockDeactivateWorkflowUseCase
    )

    expect(newState).toEqual(expectState)
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 5 * 60000);

    jest.runOnlyPendingTimers();

    expect(mockDeactivateWorkflowUseCase).toHaveBeenCalledTimes(1);
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(1, 'WFL-2');
  })

  it('should do nothing for workflows with workflowInactiveAfter > 0, if already having a timeout running', () => {
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

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-1',
      state,
      fixtureMemSaverConfigApp(),
      {},
      { workflowInactiveAfter: 5 },
      () => { }
    )

    expect(newState).toBe(state)
    expect(setTimeout).not.toHaveBeenCalled();
  })

  it('should do nothing for workflows with workflowInactiveAfter == -1', () => {
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

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-2',
      state,
      fixtureMemSaverConfigApp(),
      {},
      { workflowInactiveAfter: -1 },
      () => { }
    )

    expect(newState).toBe(state)
    expect(setTimeout).not.toHaveBeenCalled();
  })

  it('should correctly cascade the memSaver configs, when when project config is not set', () => {
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

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-2',
      state,
      fixtureMemSaverConfigApp({ workflowInactiveAfter: -1 }),
      {},
      {},
      () => { }
    )

    expect(newState).toBe(state)
    expect(setTimeout).not.toHaveBeenCalled();
  })

  it('should correctly cascade the memSaver configs, when when project config is set', () => {
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

    const newState = scheduleWorkflowDeactivationSubCase(
      'WFL-2',
      state,
      fixtureMemSaverConfigApp({ workflowInactiveAfter: 10 }),
      { workflowInactiveAfter: -1 },
      {},
      () => { }
    )

    expect(newState).toBe(state)
    expect(setTimeout).not.toHaveBeenCalled();
  })
})
