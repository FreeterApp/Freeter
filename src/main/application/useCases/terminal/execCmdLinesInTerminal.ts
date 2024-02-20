/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppsProvider } from '@/application/interfaces/appsProvider';
import { ChildProcessProvider } from '@/application/interfaces/childProcessProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';
import { createArgsFactoryToExecCmdLineInLinuxTerminal, createArgsFactoryToExecCmdLineInMacTerminal, createArgsFactoryToExecCmdLineInWinTerminal } from '@/base/apps/terminal';

interface Deps {
  appsProvider: AppsProvider;
  childProcessProvider: ChildProcessProvider;
  processProvider: ProcessProvider;
}

export function createExecCmdLinesInTerminalUseCase({ appsProvider, childProcessProvider, processProvider }: Deps) {
  const { getDefaultTerminal } = appsProvider;
  const { spawnDetached } = childProcessProvider;
  const { name: osName } = processProvider.getProcessInfo().os;
  const term = getDefaultTerminal();

  let exec: (cmdLine: string, cwd?: string) => void;

  switch (osName) {
    case 'linux': {
      const argsFactory = createArgsFactoryToExecCmdLineInLinuxTerminal(term);
      exec = (cmdLine, cwd) => {
        const [cmd, ...args] = argsFactory(cmdLine);
        spawnDetached(cmd, args, {
          cwd,
          shell: true
        })
      }
      break;
    }
    case 'win32': {
      const argsFactory = createArgsFactoryToExecCmdLineInWinTerminal(term);
      exec = (cmdLine, cwd) => {
        const [cmd, ...args] = argsFactory(cmdLine);
        spawnDetached(cmd, args, {
          cwd,
          shell: true
        })
      }
      break;
    }
    case 'darwin': {
      const argsFactory = createArgsFactoryToExecCmdLineInMacTerminal(term);
      exec = (cmdLine, cwd) => {
        const [cmd, ...args] = argsFactory(cmdLine, cwd);
        spawnDetached(cmd, args, {
          cwd
        })
      }
      break;
    }
  }

  return async function execCmdLinesInTerminalUseCase(cmdLines: ReadonlyArray<string>, cwd?: string) {
    cmdLines.forEach(cmdLine => exec(cmdLine, cwd))
  }
}

export type ExecCmdLinesInTerminalUseCase = ReturnType<typeof createExecCmdLinesInTerminalUseCase>;
