/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowBrowserWindowChannel } from '@common/ipc/channels';
import { createBrowserWindowControllers } from '@/controllers/BrowserWindow';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

function setup() {
  const showBrowserWindowUseCase = jest.fn(async () => undefined);

  const [
    showBrowserWindowController,
  ] = createBrowserWindowControllers({
    showBrowserWindowUseCase,
  })

  return {
    showBrowserWindowUseCase,
    showBrowserWindowController,
  }
}

describe('BrowserWindowControllers', () => {
  describe('ShowBrowserWindowController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().showBrowserWindowController;

      expect(channel).toBe(ipcShowBrowserWindowChannel)
    })

    it('should call a right usecase with right params', () => {
      const win = { 'test': 'obj' } as unknown as BrowserWindow;

      const { showBrowserWindowController, showBrowserWindowUseCase } = setup();
      const { handle } = showBrowserWindowController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      handle(event);

      expect(showBrowserWindowUseCase).toBeCalledTimes(1);
      expect(showBrowserWindowUseCase).toBeCalledWith(win);
    });
  })
})
