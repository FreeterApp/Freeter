/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { entityStateActions, modalScreensStateActions } from '@/base/state/actions';
import { WidgetEnv } from '@/base/widget';

type Deps = {
  appStore: AppStore;
}

export function createOpenWidgetSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = (widgetId: EntityId, env: WidgetEnv) => {
    let state = appStore.get();
    const widget = entityStateActions.widgets.getOne(state, widgetId);

    if (widget) {
      state = modalScreensStateActions.openModalScreen(state, 'widgetSettings', {
        widgetInEnv: {
          widget,
          env: {
            ...env,
            isPreview: true
          }
        }
      });
      appStore.set(state);
    }
  }

  return useCase;
}

export type OpenWidgetSettingsUseCase = ReturnType<typeof createOpenWidgetSettingsUseCase>;
