/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppStore } from '@/application/interfaces/store';
import { getOneFromEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { WidgetApiWidget } from '@/base/widgetApi';

interface Deps {
  appStore: AppStore,
}

export function createGetWidgetsInCurrentWorkflowUseCase({
  appStore,
}: Deps) {
  return function getWidgetsInCurrentWorkflowUseCase<T extends object>(
    widgetTypeId: string,
  ): WidgetApiWidget<T>[] {
    const state = appStore.get();
    const curPrjId = state.ui.projectSwitcher.currentProjectId;
    const curWflId = state.entities.projects[curPrjId]?.currentWorkflowId;
    if (!curWflId) {
      return [];
    }
    const curWfl = getOneFromEntityCollection(state.entities.workflows, curWflId);
    if (!curWfl) {
      return [];
    }

    const wgtType = getOneFromEntityCollection(state.entities.widgetTypes, widgetTypeId);
    if (!wgtType) {
      return [];
    }

    return mapIdListToEntityList(state.entities.widgets, curWfl.layout.map(item => item.widgetId))
      .filter(({ type }) => widgetTypeId === type)
      .map(({ id, coreSettings, exposedApi }) => {
        const { name } = coreSettings;
        const api = exposedApi || {};
        return {
          id,
          name,
          api: api as T
        }
      })
  }
}

export type GetWidgetsInCurrentWorkflowUseCase = ReturnType<typeof createGetWidgetsInCurrentWorkflowUseCase>;
