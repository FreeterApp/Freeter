/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DeactivateWorkflowUseCase } from '@/application/useCases/memSaver/deactivateWorkflow';
import { startDelayedWorkflowDeactivationSubCase } from '@/application/useCases/memSaver/subs/startDelayedWorkflowDeactivat';
import { deactivateWorkflowSubCase } from '@/application/useCases/memSaver/subs/deactivateWorkflow';
import { EntityId } from '@/base/entity';
import { MemSaverConfigApp, MemSaverConfigPrj, MemSaverConfigWfl, calcMemSaverConfig } from '@/base/memSaver';
import { MemSaverState } from '@/base/state/ui';

export function scheduleWorkflowDeactivationSubCase(
  workflowId: EntityId,
  memSaverState: MemSaverState,
  memSaverConfigApp: MemSaverConfigApp,
  memSaverConfigPrj: MemSaverConfigPrj,
  memSaverConfigWfl: MemSaverConfigWfl,
  deactivateWorkflowUseCase: DeactivateWorkflowUseCase
): MemSaverState {
  const { workflowInactiveAfter } = calcMemSaverConfig(memSaverConfigApp, memSaverConfigPrj, memSaverConfigWfl);

  if (workflowInactiveAfter === 0) {
    memSaverState = deactivateWorkflowSubCase(workflowId, memSaverState);
  } else if (workflowInactiveAfter > 0) {
    memSaverState = startDelayedWorkflowDeactivationSubCase(workflowId, deactivateWorkflowUseCase, workflowInactiveAfter, memSaverState);
  }

  return memSaverState;
}
