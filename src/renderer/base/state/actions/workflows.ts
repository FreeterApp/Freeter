/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getManyFromEntityCollection, getOneFromEntityCollection, removeManyFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { findIdIndexOnList, mapIdListToEntityList, removeIdFromListAtIndex } from '@/base/entityList';
import { addItemToList, findIndexOrUndef } from '@/base/list';
import { AppState } from '@/base/state/app';
import { Workflow, createWorkflow, generateWorkflowName } from '@/base/workflow';

export function addWorkflowToAppState(
  appState: AppState,
  ownerProjectId: EntityId,
  newWorkflowId: EntityId,
  posByWorkflowId?: EntityId
): [appState: AppState, newWorkflow: Workflow | null] {
  const ownerProject = getOneFromEntityCollection(appState.entities.projects, ownerProjectId);
  if (!ownerProject) {
    return [appState, null];
  }

  const newWorkflow = createWorkflow(newWorkflowId, generateWorkflowName(mapIdListToEntityList(appState.entities.workflows, ownerProject.workflowIds).map(item => item?.settings.name || '')));
  const posIdx = findIndexOrUndef(ownerProject.workflowIds, posByWorkflowId)
  const newState = {
    ...appState,
    entities: {
      ...appState.entities,
      projects: updateOneInEntityCollection(appState.entities.projects, {
        id: ownerProjectId,
        changes: {
          currentWorkflowId: newWorkflowId,
          workflowIds: addItemToList(ownerProject.workflowIds, newWorkflowId, posIdx)
        }
      }),
      workflows: addOneToEntityCollection(appState.entities.workflows, newWorkflow)
    },
  }

  return [newState, newWorkflow];
}

/**
 * Deletes the specified Workflow entities, all the Widget entities belonging to the workflows,
 * and other refs to the workflows
 * @param appState AppState to update
 * @param ownerProjectId id of the project owning the workflows
 * @param workflowIdsToDelete ids of workflows to delete
 * @returns updated AppState
 */
export function deleteWorkflowsFromAppState(appState: AppState, ownerProjectId: EntityId, workflowIdsToDelete: EntityId[]): AppState {
  const ownerProject = getOneFromEntityCollection(appState.entities.projects, ownerProjectId);
  if (!ownerProject) {
    return appState;
  }
  let { currentWorkflowId, workflowIds } = ownerProject;
  const delWorkflowIds: EntityId[] = [];
  for (const workflowId of workflowIdsToDelete) {
    const workflowIdx = findIdIndexOnList(workflowIds, workflowId);
    if (workflowIdx > -1) {
      delWorkflowIds.push(workflowId);
      workflowIds = removeIdFromListAtIndex(workflowIds, workflowIdx);
      if (workflowId === currentWorkflowId) {
        currentWorkflowId = workflowIds[Math.min(workflowIdx, workflowIds.length - 1)] || ''
      }
    }
  }

  if (delWorkflowIds.length < 1) {
    return appState;
  }

  const delWidgetIds =
    getManyFromEntityCollection(appState.entities.workflows, delWorkflowIds)
      .flatMap(workflow => (workflow?.layout || []).map(item => item.widgetId));

  return {
    ...appState,
    entities: {
      ...appState.entities,
      projects: updateOneInEntityCollection(appState.entities.projects, {
        id: ownerProjectId,
        changes: {
          currentWorkflowId,
          workflowIds
        }
      }),
      widgets: removeManyFromEntityCollection(appState.entities.widgets, delWidgetIds),
      workflows: removeManyFromEntityCollection(appState.entities.workflows, delWorkflowIds)
    },
  }
}

