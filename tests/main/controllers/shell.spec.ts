/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcShellOpenExternalUrlChannel } from '@common/ipc/channels';
import { createShellControllers } from '@/controllers/shell';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';

const openExternalUrlUseCaseRes = 'open-external-url-return-res';

function setup() {
  const openExternalUrlUseCase = jest.fn(async () => openExternalUrlUseCaseRes as unknown as void);

  const [
    openExternalUrlController
  ] = createShellControllers({
    openExternalUrlUseCase,
  })

  return {
    openExternalUrlUseCase,
    openExternalUrlController,
  }
}

describe('ShellControllers', () => {
  describe('openExternalUrlController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().openExternalUrlController;

      expect(channel).toBe(ipcShellOpenExternalUrlChannel)
    })

    it('should call a right usecase with right params and return a right value', async () => {
      const testUrl = 'test://url';

      const { openExternalUrlController, openExternalUrlUseCase } = setup();
      const { handle } = openExternalUrlController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event, testUrl);

      expect(openExternalUrlUseCase).toBeCalledTimes(1);
      expect(openExternalUrlUseCase).toBeCalledWith(testUrl);
      expect(res).toBe(openExternalUrlUseCaseRes);
    });
  })
})
