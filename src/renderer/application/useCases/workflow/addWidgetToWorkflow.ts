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
export function createAddWidgetToWorkflowUseCase({
  appStore,
  idGenerator,
}: Deps) {
  const addWidgetToWorkflowUseCase = (widgetTypeId: EntityId, toWorkflowId: EntityId) => {
    const state = appStore.get();
    const [newState, newItem] = addWidgetToAppState(state, {
      type: 'workflow',
      newLayoutItemId: idGenerator(),
      workflowId: toWorkflowId
    }, widgetTypeId, idGenerator())

    if (newItem) {
      appStore.set(newState);
    }
  }

  return addWidgetToWorkflowUseCase;
}

export type AddWidgetToWorkflowUseCase = ReturnType<typeof createAddWidgetToWorkflowUseCase>;
