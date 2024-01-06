/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { generateUniqueName } from '@/base/utils';
import { WidgetSettings, WidgetType } from '@/base/widgetType';
import { MenuItem, MenuItemRole } from '@common/base/menu';

export interface WidgetCoreSettings {
  readonly name: string;
}

export type WidgetMenuItemRole = Exclude<MenuItemRole, 'togglefullscreen' | 'window' | 'minimize' | 'close' | 'help' | 'about' | 'services' | 'hide' | 'hideOthers' | 'unhide' | 'quit' | 'startSpeaking' | 'stopSpeaking' | 'appMenu' | 'fileMenu' | 'editMenu' | 'viewMenu' | 'shareMenu' | 'recentDocuments' | 'toggleTabBar' | 'selectNextTab' | 'selectPreviousTab' | 'mergeAllWindows' | 'clearRecentDocuments' | 'moveTabToNewWindow' | 'windowMenu'>;

export interface WidgetMenuItem extends MenuItem {
  role?: WidgetMenuItemRole;
}

export type WidgetMenuItems = ReadonlyArray<WidgetMenuItem>;

export type WidgetContextMenuFactory = (contextId: string, contextData: unknown) => WidgetMenuItems;

export interface Widget<TSettings = WidgetSettings> extends Entity {
  readonly type: string;
  readonly coreSettings: WidgetCoreSettings;
  readonly settings: TSettings;
}

interface WidgetEnvCommon {
  isPreview?: boolean;
}

export interface WidgetEnvAreaShelf extends WidgetEnvCommon {
  area: 'shelf';
}
export interface WidgetEnvAreaWorkflow extends WidgetEnvCommon {
  area: 'workflow';
  projectId: EntityId;
  workflowId: EntityId;
}

export type WidgetEnv = WidgetEnvAreaShelf | WidgetEnvAreaWorkflow;

export interface WidgetInEnv<TSettings = WidgetSettings> {
  env: WidgetEnv;
  widget: Widget<TSettings>;
}

export function createWidget<TSettings>(type: WidgetType<TSettings>, id: EntityId, name: string): Widget<TSettings> {
  return {
    id,
    type: type.id,
    coreSettings: {
      name
    },
    settings: type.createSettingsState({}),
  };
}

export function generateWidgetName(widgetTypeName: string, usedNames: string[]): string {
  return generateUniqueName(widgetTypeName, usedNames);
}

export function updateWidgetSettings<TSettings>(widget: Widget<TSettings>, settings: TSettings): Widget<TSettings> {
  return {
    ...widget,
    settings
  }
}

export function updateWidgetCoreSettings<TSettings>(widget: Widget<TSettings>, settings: WidgetCoreSettings): Widget<TSettings> {
  return {
    ...widget,
    coreSettings: settings
  }
}

export function createWidgetEnv(envData: WidgetEnvAreaShelf): WidgetEnvAreaShelf;
export function createWidgetEnv(envData: WidgetEnvAreaWorkflow): WidgetEnvAreaWorkflow;
export function createWidgetEnv(envData: WidgetEnv): WidgetEnv {
  const widgetEnv = {
    ...envData
  };

  // widgetEnv objects are shared between widgets,
  // they should be protected from any changes
  Object.freeze(widgetEnv);

  return widgetEnv;
}

export function getWidgetDisplayName(widget?: Widget, type?: WidgetType): string {
  if (widget && widget.coreSettings.name !== '') {
    return widget.coreSettings.name;
  }
  if (type && type.name !== '') {
    return type.name;
  }
  return '';
}
