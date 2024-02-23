/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { sanitizeUrl } from '@common/helpers/sanitizeUrl';
import { ShellProvider } from '../../interfaces/shellProvider';

interface Deps {
  shellProvider: ShellProvider;
}

export function createOpenExternalUrlUseCase({ shellProvider }: Deps) {
  return async function openExternalUrlUseCase(url: string): Promise<void> {
    const sanitUrl = sanitizeUrl(url);
    if (sanitUrl) {
      return shellProvider.openExternal(sanitUrl);
    }
    return undefined;
  }
}

export type OpenExternalUrlUseCase = ReturnType<typeof createOpenExternalUrlUseCase>;
