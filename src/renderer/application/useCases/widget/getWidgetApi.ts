/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { ShellProvider } from '@/application/interfaces/shellProvider';
import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { EntityId } from '@/base/entity';
import { WidgetApiModuleName, WidgetApiSetContextMenuFactoryHandler, WidgetApiUpdateActionBarHandler, createWidgetApiFactory } from '@/base/widgetApi';
import { ObjectManager } from '@common/base/objectManager';
import { TerminalProvider } from '@/application/interfaces/terminalProvider';

interface Deps {
  clipboardProvider: ClipboardProvider;
  widgetDataStorageManager: ObjectManager<DataStorageRenderer>;
  processProvider: ProcessProvider;
  shellProvider: ShellProvider;
  terminalProvider: TerminalProvider;
}
function _createWidgetApiFactory({
  clipboardProvider,
  processProvider,
  shellProvider,
  widgetDataStorageManager,
  terminalProvider,
}: Deps, forPreview: boolean) {
  return createWidgetApiFactory(
    (_widgetId, updateActionBarHandler, setWidgetContextMenuFactoryHandler) => ({
      updateActionBar: !forPreview ? (actionBarItems) => {
        updateActionBarHandler(actionBarItems);
      } : () => undefined,
      setContextMenuFactory: !forPreview ? (factory) => {
        setWidgetContextMenuFactoryHandler(factory);
      } : () => undefined
    }),
    {
      clipboard: () => ({
        writeBookmark: (title, url) => clipboardProvider.writeBookmark(title, url),
        writeText: (text) => clipboardProvider.writeText(text)
      }),
      dataStorage: (widgetId) => {
        const widgetDataStorage = widgetDataStorageManager.getObject(widgetId);
        return {
          clear: async () => (await widgetDataStorage).clear(),
          getText: async (key) => (await widgetDataStorage).getText(key),
          remove: async (key) => (await widgetDataStorage).deleteItem(key),
          setText: async (key, value) => (await widgetDataStorage).setText(key, value),
          getKeys: async () => (await widgetDataStorage).getKeys()
        }
      },
      process: () => ({
        getProcessInfo: () => processProvider.getProcessInfo()
      }),
      shell: () => ({
        openExternalUrl: (url) => shellProvider.openExternal(url),
        openPath: (path) => shellProvider.openPath(path)
      }),
      terminal: () => ({
        execCmdLines: (cmdLines, cwd) => terminalProvider.execCmdLines(cmdLines, cwd)
      }),
    }
  )
}

export function createGetWidgetApiUseCase(deps: Deps) {
  const widgetApiFactory = _createWidgetApiFactory(deps, false);
  const widgetApiPreviewFactory = _createWidgetApiFactory(deps, true);

  function getWidgetApiUseCase(
    widgetId: EntityId,
    forPreview: boolean,
    updateActionBarHandler: WidgetApiUpdateActionBarHandler,
    setContextMenuFactoryHandler: WidgetApiSetContextMenuFactoryHandler,
    requiredModules: WidgetApiModuleName[]
  ) {
    return forPreview
      ? widgetApiPreviewFactory(widgetId, updateActionBarHandler, setContextMenuFactoryHandler, requiredModules)
      : widgetApiFactory(widgetId, updateActionBarHandler, setContextMenuFactoryHandler, requiredModules);
  }

  return getWidgetApiUseCase;
}

export type GetWidgetApiUseCase = ReturnType<typeof createGetWidgetApiUseCase>;
