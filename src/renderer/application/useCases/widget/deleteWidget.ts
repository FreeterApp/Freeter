/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { deleteWidgetsFromAppState } from '@/base/state/actions';
import { WidgetEnv, getWidgetDisplayName } from '@/base/widget';

type Deps = {
  appStore: AppStore;
  dialog: DialogProvider;
}
export function createDeleteWidgetUseCase({
  appStore,
  dialog,
}: Deps) {
  const useCase = async (widgetId: EntityId, env: WidgetEnv) => {
    const state = appStore.get();
    const widget = getOneFromEntityCollection(state.entities.widgets, widgetId);
    if (widget) {
      const widgetType = getOneFromEntityCollection(state.entities.widgetTypes, widget.type);
      const name = getWidgetDisplayName(widget, widgetType);
      const dialogRes = await dialog.showMessageBox({ message: `Are you sure you want to delete the "${name}" widget?`, buttons: ['Ok', 'Cancel'], cancelId: 1, defaultId: 1, type: 'warning' })
      if (dialogRes.response === 0) {
        appStore.set(deleteWidgetsFromAppState(state, env, [widgetId]));
      }
    }
  }

  return useCase;
}

export type DeleteWidgetUseCase = ReturnType<typeof createDeleteWidgetUseCase>;
