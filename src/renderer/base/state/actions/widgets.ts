/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection, removeManyFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { removeItemFromList } from '@/base/list';
import { AppState } from '@/base/state/app';
import { Widget, WidgetEnv, createWidget, generateWidgetName } from '@/base/widget';
import { WidgetLayoutItemWH, WidgetLayoutItemXY, createLayoutItem, createLayoutItemAtFreeArea } from '@/base/widgetLayout';
import { createListItem } from '@/base/widgetList';

type WidgetAddTo = {
  type: 'workflow';
  workflowId: EntityId;
  newLayoutItemId: EntityId;
  newLayoutItemXY?: WidgetLayoutItemXY;
  newLayoutItemWH?: WidgetLayoutItemWH;
} | {
  type: 'shelf';
  targetListItemId: EntityId | null;
  newListItemId: EntityId;
};
export function addWidgetToAppState(
  appState: AppState,
  addTo: WidgetAddTo,
  widgetTypeId: string,
  newWidgetId: EntityId
): [appState: AppState, newWidget: Widget | null] {
  const widgetType = getOneFromEntityCollection(appState.entities.widgetTypes, widgetTypeId);
  if (!widgetType) {
    return [appState, null];
  }

  if (addTo.type === 'shelf') {
    const { widgetList } = appState.ui.shelf;
    const newWidget = createWidget(widgetType, newWidgetId, generateWidgetName(widgetType.name, mapIdListToEntityList(appState.entities.widgets, widgetList.map(item => item.widgetId)).map(item => item?.coreSettings.name || '')));
    const { newListItemId, targetListItemId } = addTo;
    const [newWidgetList] = createListItem(
      widgetList,
      {
        id: newListItemId,
        widgetId: newWidgetId
      },
      targetListItemId
    );
    const newState: AppState = {
      ...appState,
      entities: {
        ...appState.entities,
        widgets: addOneToEntityCollection(appState.entities.widgets, newWidget)
      },
      ui: {
        ...appState.ui,
        shelf: {
          ...appState.ui.shelf,
          widgetList: newWidgetList
        }
      }
    }

    return [newState, newWidget];

  } else if (addTo.type === 'workflow') {
    const { workflowId, newLayoutItemId, newLayoutItemXY, newLayoutItemWH } = addTo;
    const ownerWorkflow = getOneFromEntityCollection(appState.entities.workflows, workflowId);
    if (!ownerWorkflow) {
      return [appState, null];
    }

    const newWidget = createWidget(widgetType, newWidgetId, generateWidgetName(widgetType.name, mapIdListToEntityList(appState.entities.widgets, ownerWorkflow.layout.map(item => item.widgetId)).map(item => item?.coreSettings.name || '')));

    const layoutItemWH: WidgetLayoutItemWH = newLayoutItemWH || { w: widgetType.minSize.w, h: widgetType.minSize.h };

    const [newLayout] = newLayoutItemXY ? createLayoutItem(
      ownerWorkflow.layout,
      {
        id: newLayoutItemId,
        rect: {
          ...newLayoutItemXY,
          ...layoutItemWH
        },
        widgetId: newWidgetId
      }
    ) : createLayoutItemAtFreeArea(
      ownerWorkflow.layout,
      {
        id: newLayoutItemId,
        size: layoutItemWH,
        widgetId: newWidgetId
      }
    );

    const newState = {
      ...appState,
      entities: {
        ...appState.entities,
        widgets: addOneToEntityCollection(appState.entities.widgets, newWidget),
        workflows: updateOneInEntityCollection(appState.entities.workflows, {
          id: workflowId,
          changes: {
            layout: newLayout
          }
        })
      }
    }
    return [newState, newWidget];
  }

  return [appState, null];
}

/**
 * Deletes the specified Widget entitis and all refs to the widgets
 * @param appState AppState to update
 * @param env shelf or id of the workflow owning the widgets
 * @param widgetIds ids of widgets to delete
 * @returns updated AppState
 */
export function deleteWidgetsFromAppState(appState: AppState, env: WidgetEnv, widgetIds: EntityId[]): AppState {
  let updState = appState;
  let { widgetList } = appState.ui.shelf;
  const delWidgetIds: EntityId[] = [];
  if (env.area === 'workflow') {
    const { workflows } = appState.entities;
    const ownerWorkflow = getOneFromEntityCollection(workflows, env.workflowId);
    if (!ownerWorkflow) {
      return appState;
    }

    let { layout } = ownerWorkflow;

    for (const widgetId of widgetIds) {
      const widgetIdx = layout.findIndex(item => item.widgetId === widgetId);
      if (widgetIdx > -1) {
        layout = removeItemFromList(layout, widgetIdx);
        delWidgetIds.push(widgetId);
      }
    }

    updState = {
      ...updState,
      entities: {
        ...updState.entities,
        workflows: updateOneInEntityCollection(updState.entities.workflows, {
          id: ownerWorkflow.id,
          changes: {
            layout
          }
        })
      }
    }
  } else if (env.area === 'shelf') {
    for (const widgetId of widgetIds) {
      const widgetIdx = widgetList.findIndex(item => item.widgetId === widgetId);
      if (widgetIdx > -1) {
        widgetList = removeItemFromList(widgetList, widgetIdx);
        delWidgetIds.push(widgetId);
      }
    }
    updState = {
      ...updState,
      ui: {
        ...updState.ui,
        shelf: {
          ...updState.ui.shelf,
          widgetList
        }
      }
    }
  }

  if (delWidgetIds.length < 1) {
    return appState;
  }

  return {
    ...updState,
    entities: {
      ...updState.entities,
      widgets: removeManyFromEntityCollection(updState.entities.widgets, delWidgetIds),
    },
  }
}
