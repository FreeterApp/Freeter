/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { OpenFileDialogConfig, OpenDialogResult } from '@common/base/dialog';

interface Deps {
  dialogProvider: DialogProvider;
}

export function createShowOpenFileDialogUseCase(deps: Deps) {
  const { dialogProvider } = deps;
  return async function showOpenFileDialogUseCase(browserWindow: BrowserWindow | null, config: OpenFileDialogConfig): Promise<OpenDialogResult> {
    return dialogProvider.showOpenFileDialog(browserWindow, config);
  }
}

export type ShowOpenFileDialogUseCase = ReturnType<typeof createShowOpenFileDialogUseCase>;
