/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcExecCmdLinesInTerminalArgs, IpcExecCmdLinesInTerminalRes, ipcExecCmdLinesInTerminalChannel } from '@common/ipc/channels';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { TerminalProvider } from '@/application/interfaces/terminalProvider';

export function createTerminalProvider(): TerminalProvider {
  return {
    execCmdLines: async (cmdLines, cwd) => electronIpcRenderer.invoke<IpcExecCmdLinesInTerminalArgs, IpcExecCmdLinesInTerminalRes>(
      ipcExecCmdLinesInTerminalChannel,
      cmdLines,
      cwd
    )
  }
}
