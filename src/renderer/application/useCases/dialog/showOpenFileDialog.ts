/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { OpenFileDialogConfig } from '@common/base/dialog';

type Deps = {
  dialog: DialogProvider;
}

export function createShowOpenFileDialogUseCase({
  dialog
}: Deps) {
  const showOpenFileDialog = (cfg: OpenFileDialogConfig) => dialog.showOpenFileDialog(cfg);

  return showOpenFileDialog;
}

export type ShowOpenFileDialogUseCase = ReturnType<typeof createShowOpenFileDialogUseCase>;
