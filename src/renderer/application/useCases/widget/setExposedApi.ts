/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { updateOneInEntityCollection } from '@/base/entityCollection';

interface Deps {
  appStore: AppStore,
}

export function createSetExposedApiUseCase({
  appStore,
}: Deps) {
  return function setExposedApiUseCase(
    widgetId: EntityId,
    api: object
  ) {
    const state = appStore.get();
    const newWidgets = updateOneInEntityCollection(state.entities.widgets, {
      changes: {
        exposedApi: api
      },
      id: widgetId
    })
    if (newWidgets !== state.entities.widgets) {
      appStore.set({
        ...state,
        entities: {
          ...state.entities,
          widgets: newWidgets
        }
      })
    }
  }
}

export type SetExposedApiUseCase = ReturnType<typeof createSetExposedApiUseCase>;
