/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { resetDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/resetDelayedWorkflowDeactivation';
import { EntityId } from '@/base/entity';
import { addItemToList } from '@/base/list';
import { findItemIndexOnMemSaverWorkflowList } from '@/base/memSaver';
import { MemSaverState } from '@/base/state/ui';

export function activateWorkflowSubCase(
  projectId: EntityId,
  workflowId: EntityId,
  memSaver: MemSaverState
): MemSaverState {
  if (workflowId) {
    memSaver = resetDelayedWorkflowDeactivationSubCase(workflowId, memSaver);
    if (findItemIndexOnMemSaverWorkflowList(memSaver.activeWorkflows, workflowId) < 0) {
      memSaver = {
        ...memSaver,
        activeWorkflows: addItemToList(memSaver.activeWorkflows, {
          prjId: projectId,
          wflId: workflowId
        })
      }
    }
  }

  return memSaver;
}
