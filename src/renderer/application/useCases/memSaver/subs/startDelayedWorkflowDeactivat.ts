/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { EntityId } from '@/base/entity';
import { MemSaverState } from '@/base/state/ui';

export function startDelayedWorkflowDeactivationSubCase(
  workflowId: EntityId,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase,
  delay: number,
  memSaverState: MemSaverState
): MemSaverState {
  if (!memSaverState.workflowTimeouts[workflowId]) {
    memSaverState = {
      ...memSaverState,
      workflowTimeouts: {
        ...memSaverState.workflowTimeouts,
        [workflowId]: setTimeout(() => deactivateWorkflowUseCase(workflowId), delay * 60000)
      }
    }
  }

  return memSaverState;
}
