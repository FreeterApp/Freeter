/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ChildProcessProvider } from '@/application/interfaces/childProcessProvider';

interface Deps {
  childProcessProvider: ChildProcessProvider;
}

export function createOpenAppUseCase({ childProcessProvider }: Deps) {
  const { spawnDetached } = childProcessProvider;

  return function openAppUseCase(appPath: string, args?: string[]) {
    spawnDetached(appPath, args || [], {
      shell: false
    })
  }
}

export type OpenAppUseCase = ReturnType<typeof createOpenAppUseCase>;
