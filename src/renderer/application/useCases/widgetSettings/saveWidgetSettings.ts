/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { entityStateActions, modalScreensStateActions } from '@/base/state/actions';

type Deps = {
  appStore: AppStore;
}

export function createSaveWidgetSettingsUseCase({
  appStore,
}: Deps) {
  const useCase = () => {
    let state = appStore.get();
    const { widgetInEnv } = state.ui.modalScreens.data.widgetSettings;
    if (!widgetInEnv) {
      return;
    }
    const { widget } = widgetInEnv;

    state = entityStateActions.widgets.updateOne(state, {
      id: widget.id,
      changes: {
        coreSettings: widget.coreSettings,
        settings: widget.settings
      }
    })
    state = modalScreensStateActions.closeModalScreen(state, 'widgetSettings');
    appStore.set(state);
  }

  return useCase;
}

export type SaveWidgetSettingsUseCase = ReturnType<typeof createSaveWidgetSettingsUseCase>;
