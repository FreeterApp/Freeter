/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcGetProcessInfoChannel } from '@common/ipc/channels';
import { createProcessControllers } from '@/controllers/process';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';
import { ProcessInfo } from '@common/base/process';

const getProcessInfoUseCaseRes = 'get-process-info-return-res';

function setup() {
  const getProcessInfoUseCase = jest.fn(async () => getProcessInfoUseCaseRes as unknown as ProcessInfo);

  const [
    getProcessInfoController
  ] = createProcessControllers({
    getProcessInfoUseCase,
  })

  return {
    getProcessInfoUseCase,
    getProcessInfoController,
  }
}

describe('ProcessControllers', () => {
  describe('getProcessInfoController', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().getProcessInfoController;

      expect(channel).toBe(ipcGetProcessInfoChannel)
    })

    it('should call a right usecase and return a right value', async () => {
      const { getProcessInfoController, getProcessInfoUseCase } = setup();
      const { handle } = getProcessInfoController;
      const event = fixtureIpcMainEvent();

      const res = await handle(event);

      expect(getProcessInfoUseCase).toBeCalledTimes(1);
      expect(res).toBe(getProcessInfoUseCaseRes);
    });
  })
})
