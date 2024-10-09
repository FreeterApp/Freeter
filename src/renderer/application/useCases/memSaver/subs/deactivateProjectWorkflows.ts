/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { startDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/startDelayedWorkflowDeactivat';
import { deactivateWorkflowSubCase } from '@/application/useCases/memSaver/subs/deactivateWorkflow';
import { EntityList } from '@/base/entityList';
import { MemSaverConfigApp, MemSaverConfigPrj, calcMemSaverConfig } from '@/base/memSaver';
import { MemSaverState } from '@/base/state/ui';
import { Workflow } from '@/base/workflow';

export function deactivateProjectWorkflowsSubCase(
  projectWorkflows: EntityList<Workflow>,
  memSaverConfigApp: MemSaverConfigApp,
  memSaverConfigPrj: MemSaverConfigPrj,
  memSaver: MemSaverState,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase
): MemSaverState {
  for (const wfl of projectWorkflows) {
    const { workflowInactiveAfter } = calcMemSaverConfig(memSaverConfigApp, memSaverConfigPrj, wfl.settings.memSaver);
    if (workflowInactiveAfter > 0) {
      memSaver = startDelayedWorkflowDeactivationSubCase(wfl.id, () => deactivateWorkflowUseCase(wfl.id), workflowInactiveAfter, memSaver);
    } else {
      memSaver = deactivateWorkflowSubCase(wfl.id, memSaver);
    }
  }

  return memSaver;
}
