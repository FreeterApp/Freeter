/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetTrayMenuChannel } from '@common/ipc/channels';
import { createTrayMenuControllers } from '@/controllers/trayMenu';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';
import { MenuItemsIpc } from '@common/base/menu';
import { fixtureMenuItemIpcA, fixtureMenuItemIpcB } from '@testscommon/base/fixtures/menu';
import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { WebContents } from '@/application/interfaces/webContents';

function setup() {
  const setTrayMenuUseCase = jest.fn(async () => undefined);

  const [
    setTrayMenuController,
  ] = createTrayMenuControllers({
    setTrayMenuUseCase,
  })

  return {
    setTrayMenuUseCase,
    setTrayMenuController,
  }
}

describe('TrayMenuControllers', () => {
  describe('SetTrayMenuController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setTrayMenuController;

      expect(channel).toBe(ipcSetTrayMenuChannel)
    })

    it('should call a right usecase with right params', () => {
      const win = { 'test': 'obj' } as unknown as BrowserWindow;
      const webContents = { 'test': 'obj' } as unknown as WebContents;
      const testItems: MenuItemsIpc = [fixtureMenuItemIpcA(), fixtureMenuItemIpcB()];

      const { setTrayMenuController, setTrayMenuUseCase } = setup();
      const { handle } = setTrayMenuController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win,
        sender: webContents
      });

      handle(event, testItems);

      expect(setTrayMenuUseCase).toBeCalledTimes(1);
      expect(setTrayMenuUseCase).toBeCalledWith(testItems, win, webContents);
    });
  })
})
