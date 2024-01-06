/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { WidgetContextMenuFactory } from '@/base/widget';
import { ActionBarItems } from './actionBar';
import { ProcessInfo } from '@common/base/process';

interface WidgetApiCommon {
  readonly updateActionBar: (actionBarItems: ActionBarItems) => void;
  readonly setContextMenuFactory: (factory: WidgetContextMenuFactory) => void;
}

interface WidgetApiModules {
  readonly clipboard: {
    writeBookmark: (title: string, url: string) => void;
    writeText: (text: string) => void;
  };
  readonly dataStorage: {
    getText: (key: string) => Promise<string | undefined>;
    setText: (key: string, value: string) => Promise<void>;
    remove: (key: string) => Promise<void>;
    clear: () => Promise<void>;
    getKeys: () => Promise<string[]>;
  };
  readonly process: {
    getProcessInfo: () => ProcessInfo;
  };
  readonly shell: {
    openExternalUrl: (url: string) => void;
  };
}

export type WidgetApiModuleName = keyof WidgetApiModules;

export interface WidgetApi extends WidgetApiCommon, WidgetApiModules { }

export type WidgetApiUpdateActionBarHandler = (actionBarItems: ActionBarItems) => void;
export type WidgetApiSetContextMenuFactoryHandler = (factory: WidgetContextMenuFactory) => void;
export type WidgetApiCommonFactory = (
  widgetId: EntityId,
  updateActionBarHandler: WidgetApiUpdateActionBarHandler,
  setContextMenuFactoryHandler: WidgetApiSetContextMenuFactoryHandler,
) => WidgetApiCommon;
type WidgetApiModuleFactory<N extends WidgetApiModuleName> = (widgetId: EntityId) => WidgetApiModules[N];
export type WidgetApiModuleFactories = {
  [N in WidgetApiModuleName]: WidgetApiModuleFactory<N>;
};

export type WidgetApiFactory = (
  widgetId: EntityId,
  updateActionBarHandler: WidgetApiUpdateActionBarHandler,
  setContextMenuFactoryHandler: WidgetApiSetContextMenuFactoryHandler,
  availableModules: WidgetApiModuleName[]
) => WidgetApi;

export function createWidgetApiFactory(commonFactory: WidgetApiCommonFactory, moduleFactories: WidgetApiModuleFactories): WidgetApiFactory {
  return (
    widgetId: EntityId,
    updateActionBarHandler: WidgetApiUpdateActionBarHandler,
    setContextMenuFactoryHandler: WidgetApiSetContextMenuFactoryHandler,
    availableModules: WidgetApiModuleName[]
  ) => ({
    ...commonFactory(widgetId, updateActionBarHandler, setContextMenuFactoryHandler),
    ...Object.fromEntries(availableModules.map(featName => ([featName, moduleFactories[featName](widgetId)])))
  } as WidgetApi);
}

export interface WidgetSettingsApi<TSettings> {
  readonly updateSettings: (newSettings: TSettings) => void;
}
