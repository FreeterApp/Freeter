/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShellProvider } from '../../interfaces/shellProvider';

interface Deps {
  shellProvider: ShellProvider;
}

export function createOpenExternalUrlUseCase({ shellProvider }: Deps) {
  return async function openExternalUrlUseCase(url: string): Promise<void> {
    return shellProvider.openExternal(url);
  }
}

export type OpenExternalUrlUseCase = ReturnType<typeof createOpenExternalUrlUseCase>;
