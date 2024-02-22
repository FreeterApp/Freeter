/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShellProvider } from '../../interfaces/shellProvider';

interface Deps {
  shellProvider: ShellProvider;
}

export function createOpenPathUseCase({ shellProvider }: Deps) {
  return async function openPathUseCase(path: string): Promise<string> {
    return shellProvider.openPath(path);
  }
}

export type OpenPathUseCase = ReturnType<typeof createOpenPathUseCase>;
