/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { EntityCollection, getManyFromEntityCollection } from '@/base/entityCollection';
import { EntityIdList, findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { Project } from '@/base/project';
import { Workflow } from '@/base/workflow';

export function deleteProjectsSubCase(
  projectIdsToDelete: EntityId[],
  projectIdsList: EntityIdList,
  currentProjectId: EntityId,
  projectsState: EntityCollection<Project>,
  workflowsState: EntityCollection<Workflow>
): [
    updatedProjectIdsList: EntityIdList,
    updatedCurrentProjectId: EntityId,
    deletedProjectIds: EntityId[],
    deletedWorkflowIds: EntityId[],
    deletedWidgetIds: EntityId[]
  ] {
  const delProjectIds: EntityId[] = [];
  for (const projectId of projectIdsToDelete) {
    const projectIdx = findIdIndexOnList(projectIdsList, projectId);
    if (projectIdx > -1) {
      delProjectIds.push(projectId);
      projectIdsList = removeIdFromListAtIndex(projectIdsList, projectIdx);
      if (projectId === currentProjectId) {
        currentProjectId = projectIdsList[Math.min(projectIdx, projectIdsList.length - 1)] || ''
      }
    }
  }

  const delWorkflowIds =
    getManyFromEntityCollection(projectsState, delProjectIds)
      .flatMap(project => (project?.workflowIds || []));

  const delWidgetIds =
    getManyFromEntityCollection(workflowsState, delWorkflowIds)
      .flatMap(workflow => (workflow?.layout || []).map(item => item.widgetId));

  return [
    projectIdsList,
    currentProjectId,
    delProjectIds,
    delWorkflowIds,
    delWidgetIds
  ]
}
