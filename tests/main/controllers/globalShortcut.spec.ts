/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetMainShortcutChannel } from '@common/ipc/channels';
import { createGlobalShortcutControllers } from '@/controllers/globalShortcut';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

const setMainShortcutUseCaseRes = true;

function setup() {
  const setMainShortcutUseCase = jest.fn(async () => setMainShortcutUseCaseRes);

  const [
    setMainShortcutController,
  ] = createGlobalShortcutControllers({
    setMainShortcutUseCase
  })

  return {
    setMainShortcutUseCase,
    setMainShortcutController,
  }
}

describe('GlobalShortcutControllers', () => {
  describe('SetMainShortcutController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setMainShortcutController;

      expect(channel).toBe(ipcSetMainShortcutChannel)
    })

    it('should call a right usecase with right params and return its value', async () => {
      const win = { 'test': 'obj' } as unknown as BrowserWindow;
      const accelerator = 'Accelerator';

      const { setMainShortcutController, setMainShortcutUseCase } = setup();
      const { handle } = setMainShortcutController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      const res = await handle(event, accelerator);

      expect(setMainShortcutUseCase).toBeCalledTimes(1);
      expect(setMainShortcutUseCase).toBeCalledWith(accelerator, win);
      expect(res).toBe(setMainShortcutUseCaseRes);
    });
  })
})
