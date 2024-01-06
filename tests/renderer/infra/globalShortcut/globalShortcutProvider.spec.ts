/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetMainShortcutChannel } from '@common/ipc/channels';
import { createGlobalShortcutProvider } from '@/infra/globalShortcut/globalShortcutProvider';
import { electronIpcRenderer } from '@/infra/globals';

jest.mock('@/infra/globals');

function setup() {
  const globalShortcutProvider = createGlobalShortcutProvider();

  return {
    globalShortcutProvider
  }
}

describe('globalShortcutProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('setMainShortcut', () => {
    it('should send a message to the main process via "set-main-shortcut" channel with right args and return its value', async () => {
      const res = 'result';
      const accelerator = 'TestAccelerator';
      const { globalShortcutProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(res);

      const gotRes = await globalShortcutProvider.setMainShortcut(accelerator);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcSetMainShortcutChannel, accelerator);
      expect(gotRes).toBe(res);
    })
  })
})
