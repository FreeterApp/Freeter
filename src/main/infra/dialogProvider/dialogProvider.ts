/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { DialogProvider } from '@/application/interfaces/dialogProvider';

const title = 'Freeter';

export function createDialogProvider(): DialogProvider {
  return {
    showMessageBox: (browserWindow, config) =>
      browserWindow
        ? Electron.dialog.showMessageBox(browserWindow as unknown as Electron.BrowserWindow, { title, ...config })
        : Electron.dialog.showMessageBox({ title, ...config })
  }
}
