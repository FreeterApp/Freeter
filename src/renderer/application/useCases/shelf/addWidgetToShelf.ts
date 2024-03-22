/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { addWidgetToAppState } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
  idGenerator: IdGenerator;
}
export function createAddWidgetToShelfUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const addWidgetToShelfUseCase = (widgetTypeId: EntityId, toPosListItemId: EntityId | null) => {
    const state = appStore.get();
    const [newState, newItem] = addWidgetToAppState(state, {
      type: 'shelf',
      newListItemId: idGenerator(),
      targetListItemId: toPosListItemId
    }, widgetTypeId, idGenerator())

    if (newItem) {
      appStore.set(newState);
    }
  }

  return addWidgetToShelfUseCase;
}

export type AddWidgetToShelfUseCase = ReturnType<typeof createAddWidgetToShelfUseCase>;
