/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { dragDropStateActions } from '@/base/state/actions';
import { DragDropFromPaletteState } from '@/base/state/ui';

type Deps = {
  appStore: AppStore;
}
export function createDragWidgetFromPaletteUseCase({
  appStore,
}: Deps) {
  const dragWidgetFromPaletteUseCase = (source: { widgetTypeId?: EntityId; widgetCopyId?: EntityId }) => {
    let state = appStore.get();
    state = dragDropStateActions.resetOver(state);
    let newDDPaletteState: DragDropFromPaletteState | undefined;
    if (source.widgetTypeId) {
      newDDPaletteState = {
        widgetTypeId: source.widgetTypeId
      }
    } else if (source.widgetCopyId) {
      newDDPaletteState = {
        widgetCopyId: source.widgetCopyId
      }
    }
    if (newDDPaletteState) {
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          dragDrop: {
            ...state.ui.dragDrop,
            from: {
              palette: newDDPaletteState
            }
          }
        }
      })
    }
  }

  return dragWidgetFromPaletteUseCase;
}

export type DragWidgetFromPaletteUseCase = ReturnType<typeof createDragWidgetFromPaletteUseCase>;
