/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MessageBoxConfig, MessageBoxResult, OpenDialogResult, OpenDirDialogConfig, OpenFileDialogConfig, SaveDialogResult, SaveFileDialogConfig } from '@common/base/dialog';
export interface DialogProvider {
  showMessageBox: (config: MessageBoxConfig) => Promise<MessageBoxResult>;
  showOpenFileDialog: (config: OpenFileDialogConfig) => Promise<OpenDialogResult>;
  showSaveFileDialog: (config: SaveFileDialogConfig) => Promise<SaveDialogResult>;
  showOpenDirDialog: (config: OpenDirDialogConfig) => Promise<OpenDialogResult>;
}
