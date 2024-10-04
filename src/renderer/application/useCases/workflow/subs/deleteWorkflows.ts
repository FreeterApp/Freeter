/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { setCurrentWorkflowSubCase } from '@/application/useCases/project/subs/setCurrentWorkflowSubCase';
import { EntityId } from '@/base/entity';
import { findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { Project } from '@/base/project';
import { Workflow } from '@/base/workflow';

export function deleteWorkflowsSubCase(
  workflowsToDelete: Workflow[],
  ownerProject: Project,
): [updatedOwnerProject: Project, deletedWorkflowIds: EntityId[], deletedWidgetIds: EntityId[]] {
  let { workflowIds } = ownerProject;
  const { currentWorkflowId } = ownerProject;

  const delWorkflowIds: EntityId[] = [];
  const delWorkflows: Workflow[] = [];
  let updPrj = ownerProject;
  for (const workflow of workflowsToDelete) {
    const workflowIdx = findIdIndexOnList(workflowIds, workflow.id);
    if (workflowIdx > -1) {
      delWorkflowIds.push(workflow.id);
      delWorkflows.push(workflow);
      workflowIds = removeIdFromListAtIndex(workflowIds, workflowIdx);
      if (workflow.id === currentWorkflowId) {
        const res = setCurrentWorkflowSubCase(updPrj, workflowIds[Math.min(workflowIdx, workflowIds.length - 1)] || '')
        updPrj = res[0];
      }
    }
  }

  updPrj = {
    ...updPrj,
    workflowIds
  }

  const delWidgetIds = delWorkflows.flatMap(workflow => (workflow?.layout || []).map(item => item.widgetId));

  return [{
    ...updPrj,
    workflowIds
  }, delWorkflowIds, delWidgetIds];
}
