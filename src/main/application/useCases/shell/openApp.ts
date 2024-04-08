/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ChildProcessProvider } from '@/application/interfaces/childProcessProvider';
import { ProcessProvider } from '@/application/interfaces/processProvider';

interface Deps {
  childProcessProvider: ChildProcessProvider;
  processProvider: ProcessProvider;
}

export function createOpenAppUseCase({ childProcessProvider, processProvider }: Deps) {
  const { spawnDetached } = childProcessProvider;
  const { isMac } = processProvider.getProcessInfo();

  let openAppUseCase: (appPath: string, args?: string[]) => void;
  if (isMac) {
    openAppUseCase = (appPath, args) => {
      spawnDetached('open', [appPath, '--args', ...(args || [])], {
        shell: false
      })
    }
  } else {
    openAppUseCase = (appPath, args) => {
      spawnDetached(appPath, args || [], {
        shell: false
      })
    }
  }
  return openAppUseCase;
}

export type OpenAppUseCase = ReturnType<typeof createOpenAppUseCase>;
