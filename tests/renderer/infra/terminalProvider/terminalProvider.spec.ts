/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcExecCmdLinesInTerminalChannel } from '@common/ipc/channels';
import { createTerminalProvider } from '@/infra/terminalProvider/terminalProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

jest.mock('@/infra/mainApi/mainApi');

describe('TerminalProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('openExternal', () => {
    it('should send a message to the main process via a right ipc channel with right args', async () => {
      const testCmds = ['cmd1', 'cmd2'];
      const testCwd = 'some/dir';
      const terminalProvider = createTerminalProvider();

      await terminalProvider.execCmdLines(testCmds, testCwd);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcExecCmdLinesInTerminalChannel, testCmds, testCwd);
    })
  })
});
