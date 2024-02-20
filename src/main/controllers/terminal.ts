/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { IpcExecCmdLinesInTerminalArgs, IpcExecCmdLinesInTerminalRes, ipcExecCmdLinesInTerminalChannel } from '@common/ipc/channels';
import { ExecCmdLinesInTerminalUseCase } from '@/application/useCases/terminal/execCmdLinesInTerminal';

type Deps = {
  execCmdLinesInTerminalUseCase: ExecCmdLinesInTerminalUseCase;
}

export function createTerminalControllers({
  execCmdLinesInTerminalUseCase,
}: Deps): [
    Controller<IpcExecCmdLinesInTerminalArgs, IpcExecCmdLinesInTerminalRes>,
  ] {
  return [{
    channel: ipcExecCmdLinesInTerminalChannel,
    handle: async (_, cmdLines, cwd) => {
      execCmdLinesInTerminalUseCase(cmdLines, cwd);
    }
  }]
}
