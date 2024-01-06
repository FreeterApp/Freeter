/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { WidgetContextMenuFactory } from '@/base/widget';

interface Deps {
  // appStore: AppStore,
  contextMenuProvider: ContextMenuProvider;
}

export function createShowWidgetContextMenuUseCase({
  // appStore,
  contextMenuProvider
}: Deps) {
  return function showWidgetContextMenuUseCase(
    _widgetId: EntityId,
    contextMenuFactory: WidgetContextMenuFactory | undefined,
    contextId: string,
    contextData: unknown
  ): void {
    // const state = appStore.get();
    // const widget = entityStateActions.widgets.getOne(state, widgetId);
    if (/*widget && */contextMenuFactory) {
      contextMenuProvider.show(contextMenuFactory(contextId, contextData));
    }
  }
}

export type ShowWidgetContextMenuUseCase = ReturnType<typeof createShowWidgetContextMenuUseCase>;
