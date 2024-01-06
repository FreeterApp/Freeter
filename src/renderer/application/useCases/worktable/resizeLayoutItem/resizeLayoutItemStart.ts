/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableStateResizingItemEdges } from '@/base/state/ui';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { findEntityOnList } from '@/base/entityList';
import { entityStateActions } from '@/base/state/actions';
import { getOneFromEntityCollection } from '@/base/entityCollection';

type Deps = {
  appStore: AppStore;
}

export function createResizeLayoutItemStartUseCase({
  appStore,
}: Deps) {
  const resizeLayoutItemStartUseCase = (workflowId: EntityId, itemId: EntityId, edges: WorktableStateResizingItemEdges) => {
    const state = appStore.get();
    const workflow = entityStateActions.workflows.getOne(state, workflowId);
    if (workflow) {
      const item = findEntityOnList(workflow.layout, itemId);
      if (item) {
        const widget = getOneFromEntityCollection(state.entities.widgets, item.widgetId);
        if (widget) {
          const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widget.type);
          if (widgetType) {
            appStore.set({
              ...state,
              ui: {
                ...state.ui,
                worktable: {
                  ...state.ui.worktable,
                  resizingItem: {
                    workflowId,
                    itemId: item.id,
                    delta: {},
                    edges,
                    minSize: {
                      w: widgetType.minSize.w,
                      h: widgetType.minSize.h
                    }
                  }
                }
              }
            })
          }
        }
      }
    }
  }

  return resizeLayoutItemStartUseCase;
}

export type RezizeLayoutItemStartUseCase = ReturnType<typeof createResizeLayoutItemStartUseCase>;
