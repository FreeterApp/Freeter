/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { MemSaverState } from '@/base/state/ui';

export function resetDelayedWorkflowDeactivationSubCase(
  workflowId: EntityId,
  memSaverState: MemSaverState
): MemSaverState {
  const { workflowTimeouts } = memSaverState;
  if (workflowTimeouts[workflowId]) {
    clearTimeout(workflowTimeouts[workflowId]);
    const { [workflowId]: _, ...updWorkflowTimeouts } = workflowTimeouts;
    memSaverState = {
      ...memSaverState,
      workflowTimeouts: updWorkflowTimeouts
    }
  }

  return memSaverState;
}
