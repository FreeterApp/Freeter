/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { DialogProvider } from '@/application/interfaces/dialogProvider';

const title = 'Freeter';

export function createDialogProvider(): DialogProvider {
  return {
    showMessageBox: (browserWindow, config) => {
      const opts: Electron.MessageBoxOptions = { title, ...config };
      return browserWindow
        ? Electron.dialog.showMessageBox(browserWindow as unknown as Electron.BrowserWindow, opts)
        : Electron.dialog.showMessageBox(opts)
    },
    showOpenFileDialog: (browserWindow, { defaultPath, filters, multiSelect, title }) => {
      const opts: Electron.OpenDialogOptions = { defaultPath, filters, title, properties: ['openFile', 'createDirectory'] }
      if (multiSelect) {
        opts.properties?.push('multiSelections');
      }
      return browserWindow
        ? Electron.dialog.showOpenDialog(browserWindow as unknown as Electron.BrowserWindow, opts)
        : Electron.dialog.showOpenDialog(opts)
    },
    showSaveFileDialog: (browserWindow, { defaultPath, filters, title }) => {
      const opts: Electron.SaveDialogOptions = { defaultPath, filters, title, properties: ['showOverwriteConfirmation', 'createDirectory'] }
      return browserWindow
        ? Electron.dialog.showSaveDialog(browserWindow as unknown as Electron.BrowserWindow, opts)
        : Electron.dialog.showSaveDialog(opts)
    },
    showOpenDirDialog: (browserWindow, { defaultPath, multiSelect, title }) => {
      const opts: Electron.OpenDialogOptions = { defaultPath, title, properties: ['openDirectory', 'createDirectory'] }
      if (multiSelect) {
        opts.properties?.push('multiSelections');
      }
      return browserWindow
        ? Electron.dialog.showOpenDialog(browserWindow as unknown as Electron.BrowserWindow, opts)
        : Electron.dialog.showOpenDialog(opts)
    }
  }
}
