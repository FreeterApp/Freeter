/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { CreateWidgetSubCase } from '@/application/useCases/widget/subs/createWidget';
import { AddItemToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/addItemToWidgetLayout';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { getAllWidgetNamesFromWidgetLayout } from '@/base/state/actions/usedNames';
import { generateWidgetName } from '@/base/widget';
import { WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';

type Deps = {
  appStore: AppStore;
  createWidgetSubCase: CreateWidgetSubCase;
  addItemToWidgetLayoutSubCase: AddItemToWidgetLayoutSubCase;
}
export function createAddWidgetToWorkflowUseCase({
  appStore,
  createWidgetSubCase,
  addItemToWidgetLayoutSubCase,
}: Deps) {
  const addWidgetToWorkflowUseCase = (widgetTypeId: EntityId, toWorkflowId: EntityId, layoutItemXY?: WidgetLayoutItemXY, layoutItemWH?: WidgetLayoutItemWH) => {
    const state = appStore.get();
    const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widgetTypeId);
    if (!widgetType) {
      return;
    }

    const toWorkflow = getOneFromEntityCollection(state.entities.workflows, toWorkflowId);
    if (!toWorkflow) {
      return;
    }

    const newWidget = createWidgetSubCase(
      widgetType,
      generateWidgetName(widgetType.name, getAllWidgetNamesFromWidgetLayout(state.entities.widgets, toWorkflow.layout))
    )
    const newWidgetLayout = addItemToWidgetLayoutSubCase(
      newWidget.id,
      toWorkflow.layout,
      layoutItemWH || { w: widgetType.minSize.w, h: widgetType.minSize.h },
      layoutItemXY
    )

    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        widgets: addOneToEntityCollection(state.entities.widgets, newWidget),
        workflows: updateOneInEntityCollection(state.entities.workflows, {
          id: toWorkflow.id,
          changes: {
            layout: newWidgetLayout
          }
        })
      }
    });
  }

  return addWidgetToWorkflowUseCase;
}

export type AddWidgetToWorkflowUseCase = ReturnType<typeof createAddWidgetToWorkflowUseCase>;
