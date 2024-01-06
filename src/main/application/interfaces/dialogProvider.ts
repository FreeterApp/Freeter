/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { BrowserWindow } from '@/application/interfaces/browserWindow';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';
export interface DialogProvider {
  showMessageBox: (browserWindow: BrowserWindow | null, config: MessageBoxConfig) => Promise<MessageBoxResult>;
}
