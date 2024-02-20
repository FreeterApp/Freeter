/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShellOpenExternalUrlChannel } from '@common/ipc/channels';
import { createShellProvider } from '@/infra/shellProvider/shellProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

jest.mock('@/infra/mainApi/mainApi');

describe('ShellProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('openExternal', () => {
    it('should send a message to the main process via a right ipc channel with right args', async () => {
      const testUrl = 'test://url';
      const shellProvider = createShellProvider();

      await shellProvider.openExternal(testUrl);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcShellOpenExternalUrlChannel, testUrl);
    })
  })
});
