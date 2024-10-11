/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { resetDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/resetDelayedWorkflowDeactivation';

jest.useFakeTimers();

describe('resetDelayedWorkflowDeactivationSubCase()', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should remove the deactivation timeout for the specified workflow, when it exists', () => {
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

    const newState = resetDelayedWorkflowDeactivationSubCase(
      'WFL-1',
      state
    )

    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenNthCalledWith(1, 1);
    expect(newState).toEqual(expectState)
  })

  it('should do nothing, when the specified workflow does not exist', () => {
    jest.spyOn(global, 'clearTimeout');
    const state = fixtureMemSaver({
      workflowTimeouts: {
        'WFL-1': 1 as unknown as NodeJS.Timeout,
        'WFL-2': 2 as unknown as NodeJS.Timeout,
      }
    })

    const newState = resetDelayedWorkflowDeactivationSubCase(
      'NO-SUCH-ID',
      state
    )

    expect(clearTimeout).not.toHaveBeenCalled();
    expect(newState).toBe(state)
  })
})
