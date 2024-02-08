/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShowOsMessageBoxChannel } from '@common/ipc/channels';
import { createOsDialogProvider } from '@/infra/dialogProvider/osDialogProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { MessageBoxConfig } from '@common/base/dialog';

jest.mock('@/infra/mainApi/mainApi');

function setup() {
  const dialogProvider = createOsDialogProvider();

  return {
    dialogProvider
  }
}

describe('osDialogProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('showMessageBox', () => {
    it('should send a message to the main process via "show-os-message-box" channel with right args and return the returned value', async () => {
      const testCfg: MessageBoxConfig = { message: 'Test' };
      const testRes = 'Res';
      const { dialogProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(testRes);

      const gotRes = await dialogProvider.showMessageBox(testCfg);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcShowOsMessageBoxChannel, testCfg);
      expect(gotRes).toBe(testRes);
    })

  })

})
