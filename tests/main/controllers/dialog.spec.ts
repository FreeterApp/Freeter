/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowOsMessageBoxChannel, ipcShowOsOpenDirDialogChannel, ipcShowOsOpenFileDialogChannel, ipcShowOsSaveFileDialogChannel } from '@common/ipc/channels';
import { createDialogControllers } from '@/controllers/dialog';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';
import { MessageBoxConfig, OpenDialogResult, OpenDirDialogConfig, OpenFileDialogConfig, SaveDialogResult, SaveFileDialogConfig } from '@common/base/dialog';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

const showOpenDirDialogUseCaseRes = 'showOpenDirDialogUseCase-res';
const showOpenFileDialogUseCaseRes = 'showOpenFileDialogUseCase-res';
const showSaveFileDialogUseCaseRes = 'showSaveFileDialogUseCase-res';

function setup() {
  const showMessageBoxUseCase = jest.fn();
  const showOpenDirDialogUseCase = jest.fn(async () => showOpenDirDialogUseCaseRes as unknown as OpenDialogResult);
  const showOpenFileDialogUseCase = jest.fn(async () => showOpenFileDialogUseCaseRes as unknown as OpenDialogResult);
  const showSaveFileDialogUseCase = jest.fn(async () => showSaveFileDialogUseCaseRes as unknown as SaveDialogResult);

  const [
    showMessageBoxController,
    showOpenFileDialogController,
    showSaveFileDialogController,
    showOpenDirDialogController,
  ] = createDialogControllers({
    showMessageBoxUseCase,
    showOpenFileDialogUseCase,
    showSaveFileDialogUseCase,
    showOpenDirDialogUseCase,
  })

  return {
    showMessageBoxController,
    showOpenFileDialogController,
    showSaveFileDialogController,
    showOpenDirDialogController,
    showMessageBoxUseCase,
    showOpenFileDialogUseCase,
    showSaveFileDialogUseCase,
    showOpenDirDialogUseCase,
  }
}

describe('DialogControllers', () => {
  describe('showMessageBox', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().showMessageBoxController;

      expect(channel).toBe(ipcShowOsMessageBoxChannel)
    })

    it('should call a right usecase with right params', () => {
      const cfg: MessageBoxConfig = { message: 'Test' };
      const win = {} as unknown as BrowserWindow;

      const { showMessageBoxController, showMessageBoxUseCase } = setup();
      const { handle } = showMessageBoxController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      handle(event, cfg);

      expect(showMessageBoxUseCase).toBeCalledTimes(1);
      expect(showMessageBoxUseCase).toBeCalledWith(win, cfg);
    });
  })

  describe('showOpenFileDialog', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().showOpenFileDialogController;

      expect(channel).toBe(ipcShowOsOpenFileDialogChannel)
    })

    it('should call a right usecase with right params and return a right val', async () => {
      const cfg: OpenFileDialogConfig = { title: 'title' };
      const win = {} as unknown as BrowserWindow;

      const { showOpenFileDialogController, showOpenFileDialogUseCase } = setup();
      const { handle } = showOpenFileDialogController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      const res = await handle(event, cfg);

      expect(showOpenFileDialogUseCase).toBeCalledTimes(1);
      expect(showOpenFileDialogUseCase).toBeCalledWith(win, cfg);
      expect(res).toBe(showOpenFileDialogUseCaseRes);
    });
  })

  describe('showOpenDirDialog', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().showOpenDirDialogController;

      expect(channel).toBe(ipcShowOsOpenDirDialogChannel)
    })

    it('should call a right usecase with right params and return a right val', async () => {
      const cfg: OpenDirDialogConfig = { title: 'title' };
      const win = {} as unknown as BrowserWindow;

      const { showOpenDirDialogController, showOpenDirDialogUseCase } = setup();
      const { handle } = showOpenDirDialogController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      const res = await handle(event, cfg);

      expect(showOpenDirDialogUseCase).toBeCalledTimes(1);
      expect(showOpenDirDialogUseCase).toBeCalledWith(win, cfg);
      expect(res).toBe(showOpenDirDialogUseCaseRes);
    });
  })

  describe('showSaveFileDialog', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().showSaveFileDialogController;

      expect(channel).toBe(ipcShowOsSaveFileDialogChannel)
    })

    it('should call a right usecase with right params and return a right val', async () => {
      const cfg: SaveFileDialogConfig = { title: 'title' };
      const win = {} as unknown as BrowserWindow;

      const { showSaveFileDialogController, showSaveFileDialogUseCase } = setup();
      const { handle } = showSaveFileDialogController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      const res = await handle(event, cfg);

      expect(showSaveFileDialogUseCase).toBeCalledTimes(1);
      expect(showSaveFileDialogUseCase).toBeCalledWith(win, cfg);
      expect(res).toBe(showSaveFileDialogUseCaseRes);
    });
  })
})
