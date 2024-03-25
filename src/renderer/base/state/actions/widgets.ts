/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection, removeManyFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { removeItemFromList } from '@/base/list';
import { AppState } from '@/base/state/app';
import { WidgetEnv } from '@/base/widget';


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

