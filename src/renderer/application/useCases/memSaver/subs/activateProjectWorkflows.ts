/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { activateWorkflowSubCase } from '@/application/useCases/memSaver/subs/activateWorkflow';
import { startDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/startDelayedWorkflowDeactivat';
import { EntityId } from '@/base/entity';
import { EntityList } from '@/base/entityList';
import { MemSaverConfigApp, MemSaverConfigPrj, calcMemSaverConfig } from '@/base/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { Workflow } from '@/base/workflow';

export function activateProjectWorkflowsSubCase(
  projectId: EntityId,
  projectWorkflows: EntityList<Workflow>,
  projectCurrentWorkflowId: EntityId,
  memSaverConfigApp: MemSaverConfigApp,
  memSaverConfigPrj: MemSaverConfigPrj,
  memSaver: MemSaverState,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase
): MemSaverState {
  for (const wfl of projectWorkflows) {
    if (wfl.id === projectCurrentWorkflowId) {
      memSaver = activateWorkflowSubCase(projectId, wfl.id, memSaver);
    } else {
      const { activateWorkflowsOnProjectSwitch, workflowInactiveAfter } = calcMemSaverConfig(memSaverConfigApp, memSaverConfigPrj, wfl.settings.memSaver);
      if (activateWorkflowsOnProjectSwitch && workflowInactiveAfter !== 0) {
        memSaver = activateWorkflowSubCase(projectId, wfl.id, memSaver);
        if (workflowInactiveAfter > 0) {
          memSaver = startDelayedWorkflowDeactivationSubCase(wfl.id, deactivateWorkflowUseCase, workflowInactiveAfter, memSaver);
        }
      }
    }
  }

  return memSaver;
}
