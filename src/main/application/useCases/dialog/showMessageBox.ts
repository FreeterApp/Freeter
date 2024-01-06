/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';

interface Deps {
  dialogProvider: DialogProvider;
}

export function createShowMessageBoxUseCase(deps: Deps) {
  const { dialogProvider } = deps;
  return async function showMessageBoxUseCase(browserWindow: BrowserWindow | null, config: MessageBoxConfig): Promise<MessageBoxResult> {
    return dialogProvider.showMessageBox(browserWindow, config);
  }
}

export type ShowMessageBoxUseCase = ReturnType<typeof createShowMessageBoxUseCase>;
