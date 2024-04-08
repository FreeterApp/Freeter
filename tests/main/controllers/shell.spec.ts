/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShellOpenAppChannel, ipcShellOpenExternalUrlChannel, ipcShellOpenPathChannel } from '@common/ipc/channels';
import { createShellControllers } from '@/controllers/shell';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';

const openExternalUrlUseCaseRes = 'open-external-url-return-res';
const openPathUseCaseRes = 'open-path-return-res';

function setup() {
  const openAppUseCase = jest.fn();
  const openExternalUrlUseCase = jest.fn(async () => openExternalUrlUseCaseRes as unknown as void);
  const openPathUseCase = jest.fn(async () => openPathUseCaseRes);

  const [
    openAppController,
    openExternalUrlController,
    openPathController
  ] = createShellControllers({
    openAppUseCase,
    openExternalUrlUseCase,
    openPathUseCase
  })

  return {
    openAppUseCase,
    openExternalUrlUseCase,
    openPathUseCase,
    openAppController,
    openExternalUrlController,
    openPathController,
  }
}

describe('ShellControllers', () => {
  describe('openAppController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().openAppController;

      expect(channel).toBe(ipcShellOpenAppChannel)
    })

    it('should call a right usecase with right params', async () => {
      const testAppPath = 'app/path';
      const testCmdArgs = ['-a', '-r', '-g', '-s']

      const { openAppController, openAppUseCase } = setup();
      const { handle } = openAppController;
      const event = fixtureIpcMainEvent();

      await handle(event, testAppPath, testCmdArgs);

      expect(openAppUseCase).toBeCalledTimes(1);
      expect(openAppUseCase).toBeCalledWith(testAppPath, testCmdArgs);
    });
  })

  describe('openExternalUrlController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().openExternalUrlController;

      expect(channel).toBe(ipcShellOpenExternalUrlChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const testUrl = 'test://url';

      const { openExternalUrlController, openExternalUrlUseCase } = setup();
      const { handle } = openExternalUrlController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, testUrl);

      expect(openExternalUrlUseCase).toBeCalledTimes(1);
      expect(openExternalUrlUseCase).toBeCalledWith(testUrl);
      expect(res).toBe(openExternalUrlUseCaseRes);
    });
  })

  describe('openPathController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().openPathController;

      expect(channel).toBe(ipcShellOpenPathChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const testPath = 'some/file/path';

      const { openPathController, openPathUseCase } = setup();
      const { handle } = openPathController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, testPath);

      expect(openPathUseCase).toBeCalledTimes(1);
      expect(openPathUseCase).toBeCalledWith(testPath);
      expect(res).toBe(openPathUseCaseRes);
    });
  })
})
