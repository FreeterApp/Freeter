/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';
import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { TerminalProvider } from '@/application/interfaces/terminalProvider';
import { createGetWidgetApiUseCase } from '@/application/useCases/widget/getWidgetApi';
import { ActionBarItems } from '@/base/actionBar';
import { WidgetContextMenuFactory } from '@/base/widget';
import { WidgetApi, WidgetApiModuleName } from '@/base/widgetApi';
import { ObjectManager, createObjectManager } from '@common/base/objectManager';
import { ProcessInfo } from '@common/base/process';
import { mockShellProvider } from '@tests/infra/mocks/shellProvider';

const widgetId = 'WIDGET-ID';

function setup() {
  const clipboardProvider: jest.MockedObject<ClipboardProvider> = {
    writeBookmark: jest.fn(),
    writeText: jest.fn(),
  }
  const processProvider: jest.MockedObject<ProcessProvider> = {
    getProcessInfo: jest.fn()
  }
  const shellProvider = mockShellProvider({
    openApp: jest.fn(),
    openExternal: jest.fn(),
    openPath: jest.fn()
  });

  const widgetDataStorage: jest.MockedObject<DataStorageRenderer> = {
    clear: jest.fn(),
    getKeys: jest.fn(),
    getText: jest.fn(),
    deleteItem: jest.fn(),
    setText: jest.fn(),
    getJson: jest.fn(),
    setJson: jest.fn()
  };
  const widgetDataStorageManager: ObjectManager<jest.MockedObject<DataStorageRenderer>> = createObjectManager(
    async () => widgetDataStorage,
    async () => true
  )

  const terminalProvider: jest.MockedObject<TerminalProvider> = {
    execCmdLines: jest.fn()
  }

  const getWidgetsInCurrentWorkflowUseCase = jest.fn();

  const getWidgetApiUseCase = createGetWidgetApiUseCase({
    clipboardProvider,
    processProvider,
    shellProvider,
    widgetDataStorageManager,
    terminalProvider,
    getWidgetsInCurrentWorkflowUseCase,
  });
  return {
    clipboardProvider,
    processProvider,
    shellProvider,
    widgetDataStorage,
    widgetDataStorageManager,
    terminalProvider,
    getWidgetsInCurrentWorkflowUseCase,

    getWidgetApiUseCase
  }
}

describe('getWidgetApiUseCase()', () => {
  it.each<[WidgetApiModuleName[], Partial<WidgetApi>]>([
    [[], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
      exposeApi: expect.any(Function),
    }],
    [['clipboard'], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
      exposeApi: expect.any(Function),
      clipboard: expect.any(Object)
    }],
    [['dataStorage', 'shell'], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
      exposeApi: expect.any(Function),
      dataStorage: expect.any(Object),
      shell: expect.any(Object)
    }],
  ])('should correctly add common properties and required modules to WidgetApi, when requiredModules = %j', (requiredModules, expectWidgetApi) => {
    const {
      getWidgetApiUseCase
    } = setup()

    const widgetApi = getWidgetApiUseCase('WIDGET-ID', false, () => undefined, () => undefined, () => undefined, requiredModules);

    expect(widgetApi).toEqual(expectWidgetApi);
  })

  it('should correctly setup common properties, when forPreview is false', () => {
    const {
      getWidgetApiUseCase,
    } = setup()
    const testVal = 'TEST-VALUE';
    const updateWidgetActionBarHandler = jest.fn();
    const setContextMenuFactoryHandler = jest.fn();
    const exposeApiHandler = jest.fn();

    const widgetApi = getWidgetApiUseCase(widgetId, false, updateWidgetActionBarHandler, setContextMenuFactoryHandler, exposeApiHandler, []);

    widgetApi.setContextMenuFactory(testVal as unknown as WidgetContextMenuFactory);
    expect(setContextMenuFactoryHandler).toHaveBeenCalledTimes(1);
    expect(setContextMenuFactoryHandler).toHaveBeenCalledWith(testVal);

    widgetApi.updateActionBar(testVal as unknown as ActionBarItems);
    expect(updateWidgetActionBarHandler).toHaveBeenCalledTimes(1);
    expect(updateWidgetActionBarHandler).toHaveBeenCalledWith(testVal);

    widgetApi.exposeApi(testVal as unknown as object);
    expect(exposeApiHandler).toHaveBeenCalledTimes(1);
    expect(exposeApiHandler).toHaveBeenCalledWith(testVal);
  })

  it('should correctly setup common properties, when forPreview is true', () => {
    const {
      getWidgetApiUseCase,
    } = setup()
    const testVal = 'TEST-VALUE';
    const updateWidgetActionBarHandler = jest.fn();
    const setContextMenuFactoryHandler = jest.fn();
    const exposeApiHandler = jest.fn();

    const widgetApi = getWidgetApiUseCase(widgetId, true, updateWidgetActionBarHandler, setContextMenuFactoryHandler, exposeApiHandler, []);

    widgetApi.setContextMenuFactory(testVal as unknown as WidgetContextMenuFactory);
    expect(setContextMenuFactoryHandler).not.toHaveBeenCalled();

    widgetApi.updateActionBar(testVal as unknown as ActionBarItems);
    expect(updateWidgetActionBarHandler).not.toHaveBeenCalled();

    widgetApi.exposeApi(testVal as unknown as object);
    expect(exposeApiHandler).not.toHaveBeenCalled();
  })

  it('should correctly setup clipboard module', () => {
    const {
      getWidgetApiUseCase,
      clipboardProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['clipboard']);

    widgetApi.clipboard.writeBookmark('title', 'url');
    expect(clipboardProvider.writeBookmark).toHaveBeenCalledTimes(1);
    expect(clipboardProvider.writeBookmark).toHaveBeenCalledWith('title', 'url');

    widgetApi.clipboard.writeText('text');
    expect(clipboardProvider.writeText).toHaveBeenCalledTimes(1);
    expect(clipboardProvider.writeText).toHaveBeenCalledWith('text');
  })

  it('should correctly setup dataStorage module', async () => {
    const {
      getWidgetApiUseCase,
      widgetDataStorageManager
    } = setup()
    const testVal = 'TEST-VALUE';
    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['dataStorage']);
    const widgetDataStorage = await widgetDataStorageManager.getObject(widgetId);

    await widgetApi.dataStorage.clear();
    expect(widgetDataStorage.clear).toHaveBeenCalledTimes(1);
    expect(widgetDataStorage.clear).toHaveBeenCalledWith();

    widgetDataStorage.getText.mockResolvedValue(testVal);
    expect(await widgetApi.dataStorage.getText('key')).toBe(testVal);
    expect(widgetDataStorage.getText).toHaveBeenCalledTimes(1);
    expect(widgetDataStorage.getText).toHaveBeenCalledWith('key');

    await widgetApi.dataStorage.remove('key');
    expect(widgetDataStorage.deleteItem).toHaveBeenCalledTimes(1);
    expect(widgetDataStorage.deleteItem).toHaveBeenCalledWith('key');

    await widgetApi.dataStorage.setText('key', 'value');
    expect(widgetDataStorage.setText).toHaveBeenCalledTimes(1);
    expect(widgetDataStorage.setText).toHaveBeenCalledWith('key', 'value');
  })

  it('should correctly setup process module', () => {
    const {
      getWidgetApiUseCase,
      processProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['process']);

    const processInfo = { some: 'info' } as unknown as ProcessInfo;
    processProvider.getProcessInfo.mockReturnValue(processInfo)
    expect(widgetApi.process.getProcessInfo()).toBe(processInfo);
    expect(processProvider.getProcessInfo).toHaveBeenCalledTimes(1);
    expect(processProvider.getProcessInfo).toHaveBeenCalledWith();
  })

  it('should correctly setup shell module', () => {
    const {
      getWidgetApiUseCase,
      shellProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['shell']);

    widgetApi.shell.openApp('app/path', ['arg1', 'arg2']);
    expect(shellProvider.openApp).toHaveBeenCalledTimes(1);
    expect(shellProvider.openApp).toHaveBeenCalledWith('app/path', ['arg1', 'arg2']);

    widgetApi.shell.openExternalUrl('test://url');
    expect(shellProvider.openExternal).toHaveBeenCalledTimes(1);
    expect(shellProvider.openExternal).toHaveBeenCalledWith('test://url');

    widgetApi.shell.openPath('some/file/path');
    expect(shellProvider.openPath).toHaveBeenCalledTimes(1);
    expect(shellProvider.openPath).toHaveBeenCalledWith('some/file/path');
  })

  it('should correctly setup terminal module', () => {
    const {
      getWidgetApiUseCase,
      terminalProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['terminal']);

    widgetApi.terminal.execCmdLines(['cmd1', 'cmd2'], 'cwd');
    expect(terminalProvider.execCmdLines).toHaveBeenCalledTimes(1);
    expect(terminalProvider.execCmdLines).toHaveBeenCalledWith(['cmd1', 'cmd2'], 'cwd');
  })

  it('should correctly setup widgets module', () => {
    const {
      getWidgetApiUseCase,
      getWidgetsInCurrentWorkflowUseCase
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, () => undefined, ['widgets']);

    widgetApi.widgets.getWidgetsInCurrentWorkflow('widget-type');
    expect(getWidgetsInCurrentWorkflowUseCase).toHaveBeenCalledTimes(1);
    expect(getWidgetsInCurrentWorkflowUseCase).toHaveBeenCalledWith('widget-type');
  })

})
