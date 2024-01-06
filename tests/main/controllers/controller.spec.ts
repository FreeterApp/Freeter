/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { registerControllers } from '@/controllers/controller';
import { mockIpcMain } from '@tests/infra/fixtures/ipcMain';

function setup() {
  const ipcMain = mockIpcMain();

  return {
    ipcMain
  }
}


describe('Controller', () => {
  describe('registerControllers()', () => {
    it('should do nothing, when the controllers array is empty', () => {
      const { ipcMain } = setup();

      registerControllers(ipcMain, []);

      expect(ipcMain.handle).not.toBeCalled();
    });

    it('should correctly setup handlers on specified ipcMain channels', () => {
      const { ipcMain } = setup();
      const channel1 = 'CHANNEL-1';
      const channel2 = 'CHANNEL-2';
      const handle1 = jest.fn();
      const handle2 = jest.fn();

      registerControllers(ipcMain, [
        { channel: channel1, handle: handle1 },
        { channel: channel2, handle: handle2 },
      ]);

      expect(ipcMain.handle).toBeCalledTimes(2);
      expect(ipcMain.handle).toHaveBeenNthCalledWith(1, channel1, handle1);
      expect(ipcMain.handle).toHaveBeenNthCalledWith(2, channel2, handle2);
    });
  })
})
