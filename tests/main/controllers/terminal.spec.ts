/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcExecCmdLinesInTerminalChannel } from '@common/ipc/channels';
import { createTerminalControllers } from '@/controllers/terminal';
import { fixtureIpcMainEvent } from '@tests/infra/mocks/ipcMain';

function setup() {
  const execCmdLinesInTerminalUseCase = jest.fn();

  const [
    execCmdLinesInTerminalController
  ] = createTerminalControllers({
    execCmdLinesInTerminalUseCase
  })

  return {
    execCmdLinesInTerminalController,
    execCmdLinesInTerminalUseCase,
  }
}

describe('AppsControllers', () => {
  describe('execCmdLinesInTerminal', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().execCmdLinesInTerminalController;

      expect(channel).toBe(ipcExecCmdLinesInTerminalChannel)
    })

    it('should call a right usecase with right params', () => {
      const testCmdLines = ['cmd line 1', 'cmd line 2'];
      const testCwd = 'some/dir';

      const { execCmdLinesInTerminalController, execCmdLinesInTerminalUseCase } = setup();
      const { handle } = execCmdLinesInTerminalController;
      const event = fixtureIpcMainEvent();

      handle(event, testCmdLines, testCwd);

      expect(execCmdLinesInTerminalUseCase).toBeCalledTimes(1);
      expect(execCmdLinesInTerminalUseCase).toBeCalledWith(testCmdLines, testCwd);
    });
  })
})
