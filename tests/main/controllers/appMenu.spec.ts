/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetAppMenuAutoHideChannel, ipcSetAppMenuChannel } from '@common/ipc/channels';
import { createAppMenuControllers } from '@/controllers/appMenu';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';
import { MenuItemsIpc } from '@common/base/menu';
import { fixtureMenuItemIpcA, fixtureMenuItemIpcB } from '@testscommon/base/fixtures/menu';
import { WebContents } from '@/application/interfaces/webContents';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

function setup() {
  const setAppMenuUseCase = jest.fn(async () => undefined);
  const setAppMenuAutoHideUseCase = jest.fn(async () => undefined);

  const [
    setAppMenuController,
    setAppMenuAutoHideController,
  ] = createAppMenuControllers({
    setAppMenuUseCase,
    setAppMenuAutoHideUseCase
  })

  return {
    setAppMenuUseCase,
    setAppMenuAutoHideUseCase,
    setAppMenuController,
    setAppMenuAutoHideController,
  }
}

describe('AppMenuControllers', () => {
  describe('SetAppMenuController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setAppMenuController;

      expect(channel).toBe(ipcSetAppMenuChannel)
    })

    it('should call a right usecase with right params', () => {
      const webContents = { 'test': 'obj' } as unknown as WebContents;
      const testItems: MenuItemsIpc = [fixtureMenuItemIpcA(), fixtureMenuItemIpcB()];

      const { setAppMenuController, setAppMenuUseCase } = setup();
      const { handle } = setAppMenuController;
      const event = fixtureIpcMainEvent({
        sender: webContents
      });

      handle(event, testItems);

      expect(setAppMenuUseCase).toBeCalledTimes(1);
      expect(setAppMenuUseCase).toBeCalledWith(testItems, webContents);
    });
  })

  describe('SetAppMenuAutoHideController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().setAppMenuAutoHideController;

      expect(channel).toBe(ipcSetAppMenuAutoHideChannel)
    })

    it('should call a right usecase with right params', () => {
      const win = { 'test': 'obj' } as unknown as BrowserWindow;

      const { setAppMenuAutoHideController, setAppMenuAutoHideUseCase } = setup();
      const { handle } = setAppMenuAutoHideController;
      const event = fixtureIpcMainEvent({
        getSenderBrowserWindow: () => win
      });

      handle(event, true);

      expect(setAppMenuAutoHideUseCase).toBeCalledTimes(1);
      expect(setAppMenuAutoHideUseCase).toBeCalledWith(true, win);

      handle(event, false);

      expect(setAppMenuAutoHideUseCase).toHaveBeenNthCalledWith(2, false, win);
    });
  })
})
