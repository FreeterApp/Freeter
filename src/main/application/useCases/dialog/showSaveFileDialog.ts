/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { SaveFileDialogConfig, SaveDialogResult } from '@common/base/dialog';

interface Deps {
  dialogProvider: DialogProvider;
}

export function createShowSaveFileDialogUseCase(deps: Deps) {
  const { dialogProvider } = deps;
  return async function showSaveFileDialogUseCase(browserWindow: BrowserWindow | null, config: SaveFileDialogConfig): Promise<SaveDialogResult> {
    return dialogProvider.showSaveFileDialog(browserWindow, config);
  }
}

export type ShowSaveFileDialogUseCase = ReturnType<typeof createShowSaveFileDialogUseCase>;
