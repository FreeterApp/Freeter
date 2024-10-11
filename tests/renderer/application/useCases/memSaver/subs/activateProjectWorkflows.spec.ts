/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { activateProjectWorkflowsSubCase } from '@/application/useCases/memSaver/subs/activateProjectWorkflows';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowSettingsC } from '@tests/base/fixtures/workflow';
import { fixtureMemSaverConfigApp, fixtureMemSaverWorkflowA } from '@tests/base/fixtures/memSaver';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';

jest.useFakeTimers();

describe('activateProjectWorkflowsSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should activate only the current workflow, when activateWorkflowsOnProjectSwitch is false', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA()]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-ID', wflId: 'WFL-1' }]
    }

    const newState = activateProjectWorkflowsSubCase(
      'PRJ-ID',
      [fixtureWorkflowA({ id: 'WFL-1' }), fixtureWorkflowB({ id: 'WFL-2' })],
      'WFL-1',
      fixtureMemSaverConfigApp({ activateWorkflowsOnProjectSwitch: false, workflowInactiveAfter: 5 }),
      {},
      state,
      () => { }
    )

    expect(newState).toEqual(expectState)
  })

  it('should activate only the current workflow, when activateWorkflowsOnProjectSwitch is true and workflowInactiveAfter==0', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA()]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-ID', wflId: 'WFL-1' }]
    }

    const newState = activateProjectWorkflowsSubCase(
      'PRJ-ID',
      [fixtureWorkflowA({ id: 'WFL-1' }), fixtureWorkflowB({ id: 'WFL-2' })],
      'WFL-1',
      fixtureMemSaverConfigApp({ activateWorkflowsOnProjectSwitch: true, workflowInactiveAfter: 0 }),
      {},
      state,
      () => { }
    )

    expect(newState).toEqual(expectState)
  })

  it('should activate all the project\'s workflow and not setup timeouts for non-current ones, when activateWorkflowsOnProjectSwitch is true and workflowInactiveAfter<0', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA()]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-ID', wflId: 'WFL-1' }, { prjId: 'PRJ-ID', wflId: 'WFL-2' }, { prjId: 'PRJ-ID', wflId: 'WFL-3' }],
    }

    const newState = activateProjectWorkflowsSubCase(
      'PRJ-ID',
      [fixtureWorkflowA({ id: 'WFL-1' }), fixtureWorkflowB({ id: 'WFL-2' }), fixtureWorkflowC({ id: 'WFL-3' })],
      'WFL-2',
      fixtureMemSaverConfigApp({ activateWorkflowsOnProjectSwitch: true, workflowInactiveAfter: -1 }),
      {},
      state,
      () => { }
    )

    expect(newState).toEqual(expectState)
  })

  it('should not add duplicate wflId items to activeWorkflows', () => {
    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA({ wflId: 'WFL-1' })]
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-ID', wflId: 'WFL-2' }, { prjId: 'PRJ-ID', wflId: 'WFL-3' }],
    }

    const newState = activateProjectWorkflowsSubCase(
      'PRJ-ID',
      [fixtureWorkflowA({ id: 'WFL-1' }), fixtureWorkflowB({ id: 'WFL-2' }), fixtureWorkflowC({ id: 'WFL-3' })],
      'WFL-2',
      fixtureMemSaverConfigApp({ activateWorkflowsOnProjectSwitch: true, workflowInactiveAfter: -1 }),
      {},
      state,
      () => { }
    )

    expect(newState).toEqual(expectState)
  })

  it('should activate all the project\'s workflow and correctly setup deactivation timeouts, when activateWorkflowsOnProjectSwitch is true and workflowInactiveAfter>0', () => {
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');

    const state = fixtureMemSaver({
      activeWorkflows: [fixtureMemSaverWorkflowA()],
      workflowTimeouts: {
        'WFL-1': 'this str should be replaced with num' as unknown as NodeJS.Timeout,
        'WFL-2': 'this str should be removed' as unknown as NodeJS.Timeout,
      }
    })
    const expectState: MemSaverState = {
      ...state,
      activeWorkflows: [...state.activeWorkflows, { prjId: 'PRJ-ID', wflId: 'WFL-1' }, { prjId: 'PRJ-ID', wflId: 'WFL-2' }, { prjId: 'PRJ-ID', wflId: 'WFL-3' }],
      workflowTimeouts: {
        'WFL-1': expect.any(Number),
        // WFL-2 should be removed by the usecase (current workflow should not have the delayed deactivation)
        'WFL-3': expect.any(Number),
      }
    }
    const mockDeactivateWorkflowUseCase = jest.fn();

    const newState = activateProjectWorkflowsSubCase(
      'PRJ-ID',
      [fixtureWorkflowA({ id: 'WFL-1' }), fixtureWorkflowB({ id: 'WFL-2' }), fixtureWorkflowC({ id: 'WFL-3', settings: fixtureWorkflowSettingsC({ memSaver: { workflowInactiveAfter: 10 } }) })],
      'WFL-2',
      fixtureMemSaverConfigApp({ activateWorkflowsOnProjectSwitch: true, workflowInactiveAfter: 5 }),
      {},
      state,
      mockDeactivateWorkflowUseCase
    )

    expect(newState).toEqual(expectState);
    expect(clearTimeout).toHaveBeenCalledTimes(2);
    expect(clearTimeout).toHaveBeenNthCalledWith(1, state.workflowTimeouts['WFL-1']);
    expect(clearTimeout).toHaveBeenNthCalledWith(2, state.workflowTimeouts['WFL-2']);
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 5 * 60000);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 10 * 60000);

    jest.runOnlyPendingTimers();

    expect(mockDeactivateWorkflowUseCase).toHaveBeenCalledTimes(2);
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(1, 'WFL-1');
    expect(mockDeactivateWorkflowUseCase).toHaveBeenNthCalledWith(2, 'WFL-3');
  })
})
