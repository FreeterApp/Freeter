/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createBrowserWindowProvider } from '@/infra/browserWindowProvider/browserWindowProvider';
import { electronIpcRenderer } from '@/infra/globals';
import { ipcShowBrowserWindowChannel } from '@common/ipc/channels';

jest.mock('@/infra/globals');

function setup() {
  const browserWindowProvider = createBrowserWindowProvider();

  return {
    browserWindowProvider
  }
}

describe('BrowserWindowProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('show', () => {
    it('should send a message to the main process via "show-browser-window" channel with right args', async () => {
      const { browserWindowProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await browserWindowProvider.show();

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcShowBrowserWindowChannel);
    })
  })
})
