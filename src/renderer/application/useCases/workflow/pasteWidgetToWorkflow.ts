/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { CloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { AddWidgetToWidgetLayoutSubCase } from '@/application/useCases/workflow/addWidgetToWidgetLayoutSubCase';
import { EntityId } from '@/base/entity';
import { addOneToEntityCollection, getOneFromEntityCollection, updateOneInEntityCollection } from '@/base/entityCollection';
import { WidgetLayoutItemWH, WidgetLayoutItemXY } from '@/base/widgetLayout';

type Deps = {
  appStore: AppStore;
  cloneWidgetSubCase: CloneWidgetSubCase;
  addWidgetToWidgetLayoutSubCase: AddWidgetToWidgetLayoutSubCase;
}
export function createPasteWidgetToWorkflowUseCase({
  appStore,
  cloneWidgetSubCase,
  addWidgetToWidgetLayoutSubCase,
}: Deps) {
  const useCase = async (widgetCopyId: EntityId, toWorkflowId: EntityId, layoutItemXY?: WidgetLayoutItemXY, layoutItemWH?: WidgetLayoutItemWH) => {
    const state = appStore.get();
    const widgetCopyEntity = getOneFromEntityCollection(state.ui.copy.widgets.entities, widgetCopyId);
    if (!widgetCopyEntity) {
      return;
    }
    const { entity: widget } = widgetCopyEntity;

    const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widget.type);
    if (!widgetType) {
      return;
    }

    const toWorkflow = getOneFromEntityCollection(state.entities.workflows, toWorkflowId);
    if (!toWorkflow) {
      return;
    }

    const newWidget = await cloneWidgetSubCase(widget)

    const newLayout = addWidgetToWidgetLayoutSubCase(
      newWidget.id,
      toWorkflow.layout,
      layoutItemWH || { w: widgetType.minSize.w, h: widgetType.minSize.h },
    )

    appStore.set({
      ...state,
      entities: {
        ...state.entities,
        widgets: addOneToEntityCollection(state.entities.widgets, newWidget),
        workflows: updateOneInEntityCollection(state.entities.workflows, {
          id: toWorkflowId,
          changes: {
            layout: newLayout
          }
        }),
      }
    });
  }

  return useCase;
}

export type PasteWidgetToWorkflowUseCase = ReturnType<typeof createPasteWidgetToWorkflowUseCase>;
