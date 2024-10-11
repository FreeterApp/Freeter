/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { scheduleProjectWorkflowsDeactivationSubCase } from '@/application/useCases/memSaver/subs/scheduleProjectWorkflowsDeactivation';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowSettingsA, fixtureWorkflowSettingsB, fixtureWorkflowSettingsC } from '@tests/base/fixtures/workflow';
import { fixtureMemSaverConfigApp, fixtureMemSaverWorkflowA, fixtureMemSaverWorkflowB, fixtureMemSaverWorkflowC } from '@tests/base/fixtures/memSaver';

jest.useFakeTimers();

describe('scheduleProjectWorkflowsDeactivationSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should deactivate workflows with workflowInactiveAfter <= 0', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
        fixtureMemSaverWorkflowC({ wflId: 'WFL-3' }),
      ],
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
        'WFL-2': 2 as unknown as NodeJS.Timeout,
        'WFL-3': 3 as unknown as NodeJS.Timeout,
      }
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [
        fixtureMemSaverWorkflowC({ wflId: 'WFL-3' }),
      ],
      workflowTimeouts: {
        'WFL-3': 3 as unknown as NodeJS.Timeout,
      }
    }

    const newState = scheduleProjectWorkflowsDeactivationSubCase(
      [
        fixtureWorkflowA({ id: 'WFL-1', settings: fixtureWorkflowSettingsA({ memSaver: { workflowInactiveAfter: 0 } }) }),
        fixtureWorkflowB({ id: 'WFL-2', settings: fixtureWorkflowSettingsB({ memSaver: { workflowInactiveAfter: -1 } }) })
      ],
      fixtureMemSaverConfigApp(),
      {},
      state,
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
        fixtureMemSaverWorkflowC({ wflId: 'WFL-3' }),
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
        'WFL-3': expect.any(Number),
      }
    }
    const mockDeactivateWorkflowUseCase = jest.fn();

    const newState = scheduleProjectWorkflowsDeactivationSubCase(
      [
        fixtureWorkflowA({ id: 'WFL-1', settings: fixtureWorkflowSettingsA({ memSaver: { workflowInactiveAfter: 5 } }) }),
        fixtureWorkflowB({ id: 'WFL-2', settings: fixtureWorkflowSettingsB({ memSaver: { workflowInactiveAfter: 10 } }) }),
        fixtureWorkflowC({ id: 'WFL-3', settings: fixtureWorkflowSettingsC({ memSaver: { workflowInactiveAfter: 15 } }) }),
      ],
      fixtureMemSaverConfigApp(),
      {},
      state,
      mockDeactivateWorkflowUseCase
    )

    expect(newState).toEqual(expectState)
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 10 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 15 * 60000);

    jest.runOnlyPendingTimers();

    expect(mockDeactivateWorkflowUseCase).toHaveBeenCalledTimes(2);
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(1, 'WFL-2');
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(2, 'WFL-3');
  })

  it('should correctly cascade the memSaver configs, when when project config is not set', () => {
    jest.spyOn(global, 'setTimeout');
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
        fixtureMemSaverWorkflowC({ wflId: 'WFL-3' }),
      ],
      workflowTimeouts: {
      }
    })

    scheduleProjectWorkflowsDeactivationSubCase(
      [
        fixtureWorkflowA({ id: 'WFL-1', settings: fixtureWorkflowSettingsA({ memSaver: { workflowInactiveAfter: 5 } }) }),
        fixtureWorkflowB({ id: 'WFL-2' }),
        fixtureWorkflowC({ id: 'WFL-3', settings: fixtureWorkflowSettingsC({ memSaver: { workflowInactiveAfter: 15 } }) }),
      ],
      fixtureMemSaverConfigApp({ workflowInactiveAfter: 100 }),
      {},
      state,
      () => { }
    )

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 5 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 100 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 15 * 60000);
  })

  it('should correctly cascade the memSaver configs, when when project config is set', () => {
    jest.spyOn(global, 'setTimeout');
    const state = fixtureMemSaver({
      activeWorkflows: [
        fixtureMemSaverWorkflowA({ wflId: 'WFL-1' }),
        fixtureMemSaverWorkflowB({ wflId: 'WFL-2' }),
        fixtureMemSaverWorkflowC({ wflId: 'WFL-3' }),
      ],
      workflowTimeouts: {
      }
    })

    scheduleProjectWorkflowsDeactivationSubCase(
      [
        fixtureWorkflowA({ id: 'WFL-1', settings: fixtureWorkflowSettingsA({ memSaver: { workflowInactiveAfter: 5 } }) }),
        fixtureWorkflowB({ id: 'WFL-2' }),
        fixtureWorkflowC({ id: 'WFL-3', settings: fixtureWorkflowSettingsC({ memSaver: { workflowInactiveAfter: 15 } }) }),
      ],
      fixtureMemSaverConfigApp({ workflowInactiveAfter: 100 }),
      { workflowInactiveAfter: 200 },
      state,
      () => { }
    )

    expect(setTimeout).toHaveBeenCalledTimes(3);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 5 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 15 * 60000);
  })
})
