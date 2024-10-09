/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { resetDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/resetDelayedWorkflowDeactivation';
import { EntityId } from '@/base/entity';
import { findIdIndexOnList } from '@/base/entityList';
import { addItemToList } from '@/base/list';
import { MemSaverState } from '@/base/state/ui';

export function activateWorkflowSubCase(
  workflowId: EntityId,
  memSaver: MemSaverState
): MemSaverState {
  if (workflowId) {
    memSaver = resetDelayedWorkflowDeactivationSubCase(workflowId, memSaver);
    if (findIdIndexOnList(memSaver.activeWorkflowIds, workflowId) < 0) {
      memSaver = {
        ...memSaver,
        activeWorkflowIds: addItemToList(memSaver.activeWorkflowIds, workflowId)
      }
    }
  }

  return memSaver;
}
