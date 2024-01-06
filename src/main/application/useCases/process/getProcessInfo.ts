/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';
import { ProcessInfo } from '@common/base/process';

interface Deps {
  processProvider: ProcessProvider;
}

export function createGetProcessInfoUseCase({ processProvider }: Deps) {
  return async function getProcessInfoUseCase(): Promise<ProcessInfo> {
    return processProvider.getProcessInfo();
  }
}

export type GetProcessInfoUseCase = ReturnType<typeof createGetProcessInfoUseCase>;
