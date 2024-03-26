/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { Project } from '@/base/project';
import { Workflow } from '@/base/workflow';

export function deleteWorkflowsSubCase(
  workflowsToDelete: Workflow[],
  ownerProject: Project,
): [updatedOwnerProject: Project, deletedWorkflowIds: EntityId[], deletedWidgetIds: EntityId[]] {
  let { currentWorkflowId, workflowIds } = ownerProject;

  const delWorkflowIds: EntityId[] = [];
  const delWorkflows: Workflow[] = [];
  for (const workflow of workflowsToDelete) {
    const workflowIdx = findIdIndexOnList(workflowIds, workflow.id);
    if (workflowIdx > -1) {
      delWorkflowIds.push(workflow.id);
      delWorkflows.push(workflow);
      workflowIds = removeIdFromListAtIndex(workflowIds, workflowIdx);
      if (workflow.id === currentWorkflowId) {
        currentWorkflowId = workflowIds[Math.min(workflowIdx, workflowIds.length - 1)] || ''
      }
    }
  }

  const delWidgetIds = delWorkflows.flatMap(workflow => (workflow?.layout || []).map(item => item.widgetId));

  return [{
    ...ownerProject,
    currentWorkflowId,
    workflowIds
  }, delWorkflowIds, delWidgetIds];
}
