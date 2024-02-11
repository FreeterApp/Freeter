/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { OpenDirDialogConfig, OpenDialogResult } from '@common/base/dialog';

interface Deps {
  dialogProvider: DialogProvider;
}

export function createShowOpenDirDialogUseCase(deps: Deps) {
  const { dialogProvider } = deps;
  return async function showOpenDirDialogUseCase(browserWindow: BrowserWindow | null, config: OpenDirDialogConfig): Promise<OpenDialogResult> {
    return dialogProvider.showOpenDirDialog(browserWindow, config);
  }
}

export type ShowOpenDirDialogUseCase = ReturnType<typeof createShowOpenDirDialogUseCase>;
