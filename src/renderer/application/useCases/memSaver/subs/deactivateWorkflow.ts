/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { resetDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/resetDelayedWorkflowDeactivation';
import { EntityId } from '@/base/entity';
import { removeFromMemSaverWorkflowListById } from '@/base/memSaver';
import { MemSaverState } from '@/base/state/ui';

export function deactivateWorkflowSubCase(
  workflowId: EntityId,
  memSaver: MemSaverState
): MemSaverState {
  memSaver = resetDelayedWorkflowDeactivationSubCase(workflowId, memSaver);
  memSaver = {
    ...memSaver,
    activeWorkflows: removeFromMemSaverWorkflowListById(memSaver.activeWorkflows, workflowId)
  }

  return memSaver;
}
