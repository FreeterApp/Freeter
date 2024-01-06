/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { dragDropStateActions, entityStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}
export function createDragWidgetFromPaletteUseCase({
  appStore,
}: Deps) {
  const dragWidgetFromPaletteUseCase = (sourceWidgetTypeId: string) => {
    let state = appStore.get();
    const item = entityStateActions.widgetTypes.getOne(state, sourceWidgetTypeId);
    if (item) {
      state = dragDropStateActions.resetOver(state);
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          dragDrop: {
            ...state.ui.dragDrop,
            from: {
              palette: {
                widgetTypeId: sourceWidgetTypeId
              }
            }
          }
        }
      })
    }
  }

  return dragWidgetFromPaletteUseCase;
}

export type DragWidgetFromPaletteUseCase = ReturnType<typeof createDragWidgetFromPaletteUseCase>;
