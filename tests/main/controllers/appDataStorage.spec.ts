/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcAppDataStorageGetTextChannel, ipcAppDataStorageSetTextChannel } from '@common/ipc/channels';
import { createAppDataStorageControllers } from '@/controllers/appDataStorage';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';

const getUseCaseRes = 'GET USECASE RESULT';

function setup() {
  const getTextFromAppDataStorageUseCase = jest.fn(async () => getUseCaseRes);
  const setTextInAppDataStorageUseCase = jest.fn(async () => undefined);

  const [
    getTextFromAppDataStorageController,
    setTextInAppDataStorageController,
  ] = createAppDataStorageControllers({
    getTextFromAppDataStorageUseCase,
    setTextInAppDataStorageUseCase,
  })

  return {
    getTextFromAppDataStorageUseCase,
    setTextInAppDataStorageUseCase,

    getTextFromAppDataStorageController,
    setTextInAppDataStorageController,
  }
}

describe('AppDataStorageControllers', () => {
  describe('GetTextFromAppDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().getTextFromAppDataStorageController;

      expect(channel).toBe(ipcAppDataStorageGetTextChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const key = 'item';
      const { getTextFromAppDataStorageController, getTextFromAppDataStorageUseCase } = setup();
      const { handle } = getTextFromAppDataStorageController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, key);

      expect(getTextFromAppDataStorageUseCase).toBeCalledTimes(1);
      expect(getTextFromAppDataStorageUseCase).toBeCalledWith(key);
      expect(res).toBe(getUseCaseRes);
    });
  })

  describe('SetTextInAppDataStorageController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setTextInAppDataStorageController;

      expect(channel).toBe(ipcAppDataStorageSetTextChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const key = 'item';
      const text = 'test text';
      const { setTextInAppDataStorageController, setTextInAppDataStorageUseCase } = setup();
      const { handle } = setTextInAppDataStorageController;
      const event = fixtureIpcMainEvent();

      await handle(event, key, text);

      expect(setTextInAppDataStorageUseCase).toBeCalledTimes(1);
      expect(setTextInAppDataStorageUseCase).toBeCalledWith(key, text);
    });
  })
})
