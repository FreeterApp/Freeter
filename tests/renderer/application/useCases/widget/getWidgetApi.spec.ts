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
  const widgetDataStorageManager: ObjectManager<jest.MockedObject<DataStorageRenderer>> = createObjectManager(async () => widgetDataStorage)

  const terminalProvider: jest.MockedObject<TerminalProvider> = {
    execCmdLines: jest.fn()
  }

  const getWidgetApiUseCase = createGetWidgetApiUseCase({
    clipboardProvider,
    processProvider,
    shellProvider,
    widgetDataStorageManager,
    terminalProvider,
  });
  return {
    clipboardProvider,
    processProvider,
    shellProvider,
    widgetDataStorage,
    widgetDataStorageManager,
    terminalProvider,

    getWidgetApiUseCase
  }
}

describe('getWidgetApiUseCase()', () => {
  it.each<[WidgetApiModuleName[], Partial<WidgetApi>]>([
    [[], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
    }],
    [['clipboard'], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
      clipboard: expect.any(Object)
    }],
    [['dataStorage', 'shell'], {
      updateActionBar: expect.any(Function),
      setContextMenuFactory: expect.any(Function),
      dataStorage: expect.any(Object),
      shell: expect.any(Object)
    }],
  ])('should correctly add common properties and required modules to WidgetApi, when requiredModules = %j', (requiredModules, expectWidgetApi) => {
    const {
      getWidgetApiUseCase
    } = setup()

    const widgetApi = getWidgetApiUseCase('WIDGET-ID', false, () => undefined, () => undefined, requiredModules);

    expect(widgetApi).toEqual(expectWidgetApi);
  })

  it('should correctly setup common properties, when forPreview is false', () => {
    const {
      getWidgetApiUseCase,
    } = setup()
    const testVal = 'TEST-VALUE';
    const updateWidgetActionBarHandler = jest.fn();
    const setContextMenuFactoryHandler = jest.fn();

    const widgetApi = getWidgetApiUseCase(widgetId, false, updateWidgetActionBarHandler, setContextMenuFactoryHandler, []);

    widgetApi.setContextMenuFactory(testVal as unknown as WidgetContextMenuFactory);
    expect(setContextMenuFactoryHandler).toBeCalledTimes(1);
    expect(setContextMenuFactoryHandler).toBeCalledWith(testVal);

    widgetApi.updateActionBar(testVal as unknown as ActionBarItems);
    expect(updateWidgetActionBarHandler).toBeCalledTimes(1);
    expect(updateWidgetActionBarHandler).toBeCalledWith(testVal);
  })

  it('should correctly setup common properties, when forPreview is true', () => {
    const {
      getWidgetApiUseCase,
    } = setup()
    const testVal = 'TEST-VALUE';
    const updateWidgetActionBarHandler = jest.fn();
    const setContextMenuFactoryHandler = jest.fn();

    const widgetApi = getWidgetApiUseCase(widgetId, true, updateWidgetActionBarHandler, setContextMenuFactoryHandler, []);

    widgetApi.setContextMenuFactory(testVal as unknown as WidgetContextMenuFactory);
    expect(setContextMenuFactoryHandler).not.toBeCalled();

    widgetApi.updateActionBar(testVal as unknown as ActionBarItems);
    expect(updateWidgetActionBarHandler).not.toBeCalled();
  })

  it('should correctly setup clipboard module', () => {
    const {
      getWidgetApiUseCase,
      clipboardProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, ['clipboard']);

    widgetApi.clipboard.writeBookmark('title', 'url');
    expect(clipboardProvider.writeBookmark).toBeCalledTimes(1);
    expect(clipboardProvider.writeBookmark).toBeCalledWith('title', 'url');

    widgetApi.clipboard.writeText('text');
    expect(clipboardProvider.writeText).toBeCalledTimes(1);
    expect(clipboardProvider.writeText).toBeCalledWith('text');
  })

  it('should correctly setup dataStorage module', async () => {
    const {
      getWidgetApiUseCase,
      widgetDataStorageManager
    } = setup()
    const testVal = 'TEST-VALUE';
    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, ['dataStorage']);
    const widgetDataStorage = await widgetDataStorageManager.getObject(widgetId);

    await widgetApi.dataStorage.clear();
    expect(widgetDataStorage.clear).toBeCalledTimes(1);
    expect(widgetDataStorage.clear).toBeCalledWith();

    widgetDataStorage.getText.mockResolvedValue(testVal);
    expect(await widgetApi.dataStorage.getText('key')).toBe(testVal);
    expect(widgetDataStorage.getText).toBeCalledTimes(1);
    expect(widgetDataStorage.getText).toBeCalledWith('key');

    await widgetApi.dataStorage.remove('key');
    expect(widgetDataStorage.deleteItem).toBeCalledTimes(1);
    expect(widgetDataStorage.deleteItem).toBeCalledWith('key');

    await widgetApi.dataStorage.setText('key', 'value');
    expect(widgetDataStorage.setText).toBeCalledTimes(1);
    expect(widgetDataStorage.setText).toBeCalledWith('key', 'value');
  })

  it('should correctly setup process module', () => {
    const {
      getWidgetApiUseCase,
      processProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, ['process']);

    const processInfo = { some: 'info' } as unknown as ProcessInfo;
    processProvider.getProcessInfo.mockReturnValue(processInfo)
    expect(widgetApi.process.getProcessInfo()).toBe(processInfo);
    expect(processProvider.getProcessInfo).toBeCalledTimes(1);
    expect(processProvider.getProcessInfo).toBeCalledWith();
  })

  it('should correctly setup shell module', () => {
    const {
      getWidgetApiUseCase,
      shellProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, ['shell']);

    widgetApi.shell.openExternalUrl('test://url');
    expect(shellProvider.openExternal).toBeCalledTimes(1);
    expect(shellProvider.openExternal).toBeCalledWith('test://url');

    widgetApi.shell.openPath('some/file/path');
    expect(shellProvider.openPath).toBeCalledTimes(1);
    expect(shellProvider.openPath).toBeCalledWith('some/file/path');
  })

  it('should correctly setup terminal module', () => {
    const {
      getWidgetApiUseCase,
      terminalProvider
    } = setup()

    const widgetApi = getWidgetApiUseCase(widgetId, false, () => undefined, () => undefined, ['terminal']);

    widgetApi.terminal.execCmdLines(['cmd1', 'cmd2'], 'cwd');
    expect(terminalProvider.execCmdLines).toBeCalledTimes(1);
    expect(terminalProvider.execCmdLines).toBeCalledWith(['cmd1', 'cmd2'], 'cwd');
  })

})
