/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcWidgetDataStorageClearChannel, ipcWidgetDataStorageDeleteChannel, ipcWidgetDataStorageGetKeysChannel, ipcWidgetDataStorageGetTextChannel, ipcWidgetDataStorageSetTextChannel } from '@common/ipc/channels';
import { createWidgetDataStorageControllers } from '@/controllers/widgetDataStorage';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';

const getTextUseCaseRes = 'GET USECASE RESULT';
const getKeysUseCaseRes = ['KEY1', 'KEY2'];

function setup() {
  const getTextFromWidgetDataStorageUseCase = jest.fn(async () => getTextUseCaseRes);
  const setTextInWidgetDataStorageUseCase = jest.fn(async () => undefined);
  const clearWidgetDataStorageUseCase = jest.fn(async () => undefined);
  const deleteInWidgetDataStorageUseCase = jest.fn(async () => undefined);
  const getKeysFromWidgetDataStorageUseCase = jest.fn(async () => getKeysUseCaseRes);

  const [
    getTextFromWidgetDataStorageController,
    setTextInWidgetDataStorageController,
    deleteInWidgetDataStorageController,
    clearWidgetDataStorageController,
    getKeysFromWidgetDataStorageController,
  ] = createWidgetDataStorageControllers({
    getTextFromWidgetDataStorageUseCase,
    setTextInWidgetDataStorageUseCase,
    deleteInWidgetDataStorageUseCase,
    clearWidgetDataStorageUseCase,
    getKeysFromWidgetDataStorageUseCase,
  })

  return {
    getTextFromWidgetDataStorageUseCase,
    setTextInWidgetDataStorageUseCase,
    deleteInWidgetDataStorageUseCase,
    clearWidgetDataStorageUseCase,
    getKeysFromWidgetDataStorageUseCase,

    getTextFromWidgetDataStorageController,
    setTextInWidgetDataStorageController,
    deleteInWidgetDataStorageController,
    clearWidgetDataStorageController,
    getKeysFromWidgetDataStorageController,
  }
}

describe('WidgetDataStorageControllers', () => {
  describe('GetTextFromWidgetDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().getTextFromWidgetDataStorageController;

      expect(channel).toBe(ipcWidgetDataStorageGetTextChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const widgetId = 'widget id';
      const key = 'item';
      const { getTextFromWidgetDataStorageController, getTextFromWidgetDataStorageUseCase } = setup();
      const { handle } = getTextFromWidgetDataStorageController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, widgetId, key);

      expect(getTextFromWidgetDataStorageUseCase).toBeCalledTimes(1);
      expect(getTextFromWidgetDataStorageUseCase).toBeCalledWith(widgetId, key);
      expect(res).toBe(getTextUseCaseRes);
    });
  })

  describe('SetTextInWidgetDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setTextInWidgetDataStorageController;

      expect(channel).toBe(ipcWidgetDataStorageSetTextChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const widgetId = 'widget id';
      const key = 'item';
      const text = 'test text';
      const { setTextInWidgetDataStorageController, setTextInWidgetDataStorageUseCase } = setup();
      const { handle } = setTextInWidgetDataStorageController;
      const event = fixtureIpcMainEvent();

      await handle(event, widgetId, key, text);

      expect(setTextInWidgetDataStorageUseCase).toBeCalledTimes(1);
      expect(setTextInWidgetDataStorageUseCase).toBeCalledWith(widgetId, key, text);
    });
  })

  describe('DeleteInWidgetDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().deleteInWidgetDataStorageController;

      expect(channel).toBe(ipcWidgetDataStorageDeleteChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const widgetId = 'widget id';
      const key = 'item';
      const { deleteInWidgetDataStorageController, deleteInWidgetDataStorageUseCase } = setup();
      const { handle } = deleteInWidgetDataStorageController;
      const event = fixtureIpcMainEvent();

      await handle(event, widgetId, key);

      expect(deleteInWidgetDataStorageUseCase).toBeCalledTimes(1);
      expect(deleteInWidgetDataStorageUseCase).toBeCalledWith(widgetId, key);
    });
  })

  describe('ClearWidgetDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().clearWidgetDataStorageController;

      expect(channel).toBe(ipcWidgetDataStorageClearChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const widgetId = 'widget id';
      const { clearWidgetDataStorageController, clearWidgetDataStorageUseCase } = setup();
      const { handle } = clearWidgetDataStorageController;
      const event = fixtureIpcMainEvent();

      await handle(event, widgetId);

      expect(clearWidgetDataStorageUseCase).toBeCalledTimes(1);
      expect(clearWidgetDataStorageUseCase).toBeCalledWith(widgetId);
    });
  })

  describe('GetKeysFromWidgetDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().getKeysFromWidgetDataStorageController;

      expect(channel).toBe(ipcWidgetDataStorageGetKeysChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const widgetId = 'widget id';
      const { getKeysFromWidgetDataStorageController, getKeysFromWidgetDataStorageUseCase } = setup();
      const { handle } = getKeysFromWidgetDataStorageController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, widgetId);

      expect(getKeysFromWidgetDataStorageUseCase).toBeCalledTimes(1);
      expect(getKeysFromWidgetDataStorageUseCase).toBeCalledWith(widgetId);
      expect(res).toBe(getKeysUseCaseRes);
    });
  })
})
