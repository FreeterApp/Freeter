/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShowWidgetContextMenuUseCase } from '@/application/useCases/widget/showWidgetContextMenu';
import { entityStateActions } from '@/base/state/actions';
import { Widget, WidgetContextMenuFactory, WidgetEnv, getWidgetDisplayName } from '@/base/widget';
import { ActionBarItems } from '@/base/actionBar';
import { UseAppState } from '@/ui/hooks/appState';
import { useWidgetTypeComp } from '@/ui/hooks/useWidgetTypeComp';
import { useCallback, useMemo, useState } from 'react';
import { ReactContextMenuEvent } from '@/ui/types/events';
import { GetWidgetApiUseCase } from '@/application/useCases/widget/getWidgetApi';
import { delete14Svg, more14Svg, settings14Svg } from '@/ui/assets/images/appIcons';
import { OpenWidgetSettingsUseCase } from '@/application/useCases/widgetSettings/openWidgetSettings';
import { DeleteWidgetUseCase } from '@/application/useCases/widget/deleteWidget';
import { EntityId } from '@/base/entity';
import { CopyWidgetUseCase } from '@/application/useCases/widget/copyWidget';
import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';

type Deps = {
  useAppState: UseAppState;
  showContextMenuUseCase: ShowContextMenuUseCase;
  showWidgetContextMenuUseCase: ShowWidgetContextMenuUseCase;
  getWidgetApiUseCase: GetWidgetApiUseCase;
  openWidgetSettingsUseCase: OpenWidgetSettingsUseCase;
  deleteWidgetUseCase: DeleteWidgetUseCase;
  copyWidgetUseCase: CopyWidgetUseCase;
}

export interface WidgetProps {
  widget: Widget;
  env: WidgetEnv;
}

function getContextId(el: HTMLElement): string {
  let curEl: HTMLElement | null = el;
  while (curEl) {
    const contextId = curEl.getAttribute('data-widget-context');
    if (contextId !== null) {
      return contextId;
    }
    curEl = curEl.parentElement;
  }
  return '';
}

export function createWidgetViewModelHook({
  useAppState,
  showContextMenuUseCase,
  showWidgetContextMenuUseCase,
  getWidgetApiUseCase,
  openWidgetSettingsUseCase,
  deleteWidgetUseCase,
  copyWidgetUseCase,
}: Deps) {
  function showMoreActions(
    id: EntityId,
  ) {
    showContextMenuUseCase([
      {
        enabled: true,
        label: 'Copy Widget',
        doAction: async () => {
          copyWidgetUseCase(id)
        }
      }
    ])
  }
  const createActionBarItemsEditMode: (id: EntityId, env: WidgetEnv) => ActionBarItems = (id, env) => [{
    enabled: true,
    icon: settings14Svg,
    id: 'WIDGET-SETTINGS',
    title: 'Widget Settings',
    doAction: async () => {
      openWidgetSettingsUseCase(id, env);
    }
  }, {
    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-WIDGET',
    title: 'Delete Widget',
    doAction: async () => {
      deleteWidgetUseCase(id, env);
    }
  }, {
    enabled: true,
    icon: more14Svg,
    id: 'MORE-ACTIONS',
    title: 'More Actions...',
    doAction: async () => {
      showMoreActions(id);
    }
  }]

  const createContextMenuFactoryEditMode: (id: EntityId, env: WidgetEnv) => WidgetContextMenuFactory = (id, env) => () => [{
    enabled: true,
    label: 'Widget Settings',
    doAction: async () => {
      openWidgetSettingsUseCase(id, env);
    }
  }, {
    type: 'separator'
  }, {
    enabled: true,
    label: 'Copy Widget',
    doAction: async () => {
      copyWidgetUseCase(id)
    }
  }, {
    type: 'separator'
  }, {
    enabled: true,
    label: 'Delete Widget',
    doAction: async () => {
      deleteWidgetUseCase(id, env);
    }
  }]

  function useViewModel(props: WidgetProps) {
    const { widget, env } = props;
    const [
      editMode,
      dragDropFrom,
      resizingItem
    ] = useAppState(state => [
      state.ui.editMode,
      state.ui.dragDrop.from,
      state.ui.worktable.resizingItem
    ])
    const [actionBarItemsViewMode, setActionBarItemsViewMode] = useState<ActionBarItems>([]);
    const [contextMenuFactoryViewMode, setContextMenuFactoryViewMode] = useState<WidgetContextMenuFactory | undefined>(undefined);

    const widgetType = useAppState.useWithStrictEq(state => entityStateActions.widgetTypes.getOne(state, widget.type));
    const WidgetComp = useWidgetTypeComp(widgetType, 'widgetComp');
    const widgetApi = useMemo(() => getWidgetApiUseCase(
      widget.id,
      !!env.isPreview,
      setActionBarItemsViewMode,
      (factory: WidgetContextMenuFactory | undefined) => setContextMenuFactoryViewMode(() => factory),
      widgetType?.requiresApi || []
    ), [env.isPreview, widget.id, widgetType?.requiresApi])

    const widgetName = getWidgetDisplayName(widget, widgetType);

    const actionBarItems: ActionBarItems = useMemo(
      () => editMode
        ? createActionBarItemsEditMode(widget.id, env)
        : actionBarItemsViewMode,
      [actionBarItemsViewMode, editMode, env, widget.id]
    );

    const onContextMenuHandler = useCallback((event: ReactContextMenuEvent) => {
      const contextMenuFactory = editMode
        ? createContextMenuFactoryEditMode(widget.id, env)
        : contextMenuFactoryViewMode;
      if (contextMenuFactory) { // prevent default context menu handler
        event.stopPropagation();
      }
      showWidgetContextMenuUseCase(widget.id, contextMenuFactory, getContextId(<HTMLElement>event.target), event.nativeEvent.contextData);
    }, [contextMenuFactoryViewMode, editMode, env, widget.id]);

    const dontShowActionBar = !!resizingItem || !!dragDropFrom;

    return {
      editMode,
      actionBarItems,
      env,
      widget,
      widgetName,
      widgetApi,
      WidgetComp,
      dontShowActionBar,
      onContextMenuHandler,
    }
  }

  return useViewModel;
}

export type WidgetViewModelHook = ReturnType<typeof createWidgetViewModelHook>;
export type WidgetViewModel = ReturnType<WidgetViewModelHook>;
