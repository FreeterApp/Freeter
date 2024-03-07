/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { EntityId } from '@/base/entity';
import { getManyFromEntityCollection, removeManyFromEntityCollection } from '@/base/entityCollection';
import { findIdIndexOnList, removeIdFromListAtIndex } from '@/base/entityList';
import { CopyEntityResult } from '@/base/state/actions/entity';
import { copyWorkflowsInAppState } from '@/base/state/actions/workflows';
import { AppState } from '@/base/state/app';

/**
 * Deletes the specified Project entities, all the Workflow and Widget entities belonging to the projects,
 * and other refs to the projects
 * @param appState AppState to update
 * @param projectIdsToDel ids of the projects to delete
 * @returns updated AppState
 */
export function deleteProjectsFromAppState(appState: AppState, projectIdsToDel: EntityId[]): AppState {
  let { currentProjectId, projectIds } = appState.ui.projectSwitcher;
  const delProjectIds: EntityId[] = [];
  for (const projectId of projectIdsToDel) {
    const projectIdx = findIdIndexOnList(projectIds, projectId);
    if (projectIdx > -1) {
      delProjectIds.push(projectId);
      projectIds = removeIdFromListAtIndex(projectIds, projectIdx);
      if (projectId === currentProjectId) {
        currentProjectId = projectIds[Math.min(projectIdx, projectIds.length - 1)] || ''
      }
    }
  }

  if (delProjectIds.length < 1) {
    return appState;
  }

  const delWorkflowIds =
    getManyFromEntityCollection(appState.entities.projects, delProjectIds)
      .flatMap(project => (project?.workflowIds || []));

  const delWidgetIds =
    getManyFromEntityCollection(appState.entities.workflows, delWorkflowIds)
      .flatMap(workflow => (workflow?.layout || []).map(item => item.widgetId));

  return {
    ...appState,
    ui: {
      ...appState.ui,
      projectSwitcher: {
        ...appState.ui.projectSwitcher,
        currentProjectId,
        projectIds
      }
    },
    entities: {
      ...appState.entities,
      projects: removeManyFromEntityCollection(appState.entities.projects, delProjectIds),
      widgets: removeManyFromEntityCollection(appState.entities.widgets, delWidgetIds),
      workflows: removeManyFromEntityCollection(appState.entities.workflows, delWorkflowIds)
    },
  }
}

/**
 * Copies all workflows from one project to another
 * @param appState AppState to update
 * @param arrFromTo array of tuples specifying from-to project ids
 * @param idGenerator function generating unique ids
 * @returns updated AppState and ids of the new entities
 */
export function copyProjectContentInAppState(
  appState: AppState,
  arrFromTo: [fromPrjId: EntityId, toPrjId: EntityId][],
  idGenerator: IdGenerator
): {
  newState: AppState;
  newWorkflowIds: CopyEntityResult[],
  newWidgetIds: CopyEntityResult[],
} {
  const { projects } = appState.entities;
  let newState = appState;
  const newWorkflowIds: CopyEntityResult[] = [];
  const newWidgetIds: CopyEntityResult[] = [];
  for (const [fromPrjId, toPrjId] of arrFromTo) {
    const fromPrj = projects[fromPrjId];
    if (fromPrj) {
      const copyWflsRes = copyWorkflowsInAppState(newState, fromPrj.workflowIds, toPrjId, null, idGenerator, true);
      newState = copyWflsRes.newState;
      newWorkflowIds.push(...copyWflsRes.newWorkflowIds);
      newWidgetIds.push(...copyWflsRes.newWidgetIds);
    }
  }

  return {
    newState,
    newWidgetIds,
    newWorkflowIds,
  };
}
