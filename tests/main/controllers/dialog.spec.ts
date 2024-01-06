/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowOsMessageBoxChannel } from '@common/ipc/channels';
import { createDialogControllers } from '@/controllers/dialog';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';
import { MessageBoxConfig } from '@common/base/dialog';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

function setup() {
  const showMessageBoxUseCase = jest.fn();

  const [
    showMessageBoxController,
  ] = createDialogControllers({
    showMessageBoxUseCase,
  })

  return {
    showMessageBoxController,
    showMessageBoxUseCase,
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
})
