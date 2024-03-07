/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { EntityId } from '@/base/entity';
import { addManyToEntityCollection, addOneToEntityCollection, getManyFromEntityCollection, getOneFromEntityCollection, removeManyFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { EntityIdList, findIdIndexOnList, mapIdListToEntityList, removeIdFromListAtIndex } from '@/base/entityList';
import { List, addItemToList, findIndexOrUndef } from '@/base/list';
import { CopyEntityResult } from '@/base/state/actions/entity';
import { AppState } from '@/base/state/app';
import { generateUniqueName } from '@/base/utils';
import { Widget } from '@/base/widget';
import { WidgetLayoutItem } from '@/base/widgetLayout';
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
  const posIdx = posByWorkflowId !== undefined ? findIndexOrUndef(ownerProject.workflowIds, posByWorkflowId) : undefined
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

export function copyWorkflowsInAppState(
  appState: AppState,
  workflowIds: EntityIdList,
  toPrjId: EntityId,
  toPosWorkflowId: EntityId | null,
  idGenerator: IdGenerator,
  keepNamesAsIs: boolean
): {
  newState: AppState;
  newWorkflowIds: CopyEntityResult[],
  newWidgetIds: CopyEntityResult[],
} {
  const { projects, workflows, widgets } = appState.entities;
  let newState = appState;
  const addWorkflows: Workflow[] = [];
  const addWidgets: Widget[] = [];
  const newWorkflowIds: CopyEntityResult[] = [];
  const newWidgetIds: CopyEntityResult[] = [];
  const toPrj = projects[toPrjId];
  if (toPrj) {
    let toPrjWorkflowIds: List<EntityId> = [...toPrj.workflowIds];
    const wfls = mapIdListToEntityList(workflows, workflowIds)
    for (const wfl of wfls) {
      const wgtLayout: WidgetLayoutItem[] = [];
      for (const wgtLayoutItem of wfl.layout) {
        const wgt = widgets[wgtLayoutItem.widgetId];
        if (wgt) {
          const newWgt: Widget = {
            ...wgt,
            id: idGenerator()
          }
          addWidgets.push(newWgt);
          newWidgetIds.push({
            newId: newWgt.id,
            origId: wgt.id
          })
          const newWgtLayoutItem: WidgetLayoutItem = {
            ...wgtLayoutItem,
            id: idGenerator(),
            widgetId: newWgt.id
          }
          wgtLayout.push(newWgtLayoutItem)
        }
      }
      const newWfl: Workflow = {
        ...wfl,
        id: idGenerator(),
        layout: wgtLayout,
        settings: {
          ...wfl.settings,
          name: keepNamesAsIs ? wfl.settings.name : generateUniqueName(`${wfl.settings.name} Copy`, mapIdListToEntityList(workflows, toPrjWorkflowIds).map(item => item?.settings.name || ''))
        }
      }
      toPrjWorkflowIds = addItemToList(toPrjWorkflowIds, newWfl.id, toPosWorkflowId ? findIndexOrUndef(toPrjWorkflowIds, toPosWorkflowId) : undefined);
      addWorkflows.push(newWfl);
      newWorkflowIds.push({
        newId: newWfl.id,
        origId: wfl.id
      })
    }

    if (addWorkflows.length > 0) {
      newState = {
        ...newState,
        entities: {
          ...newState.entities,
          projects: {
            ...newState.entities.projects,
            [toPrjId]: {
              ...newState.entities.projects[toPrjId]!,
              workflowIds: toPrjWorkflowIds,
              currentWorkflowId: addWorkflows[0].id || ''
            }
          },
          widgets: addManyToEntityCollection(newState.entities.widgets, addWidgets),
          workflows: addManyToEntityCollection(newState.entities.workflows, addWorkflows)
        }
      }
    }
  }

  return {
    newState,
    newWidgetIds,
    newWorkflowIds,
  };
}
