/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';

export function createClipboardProvider(): ClipboardProvider {
  return {
    writeBookmark: (title, url) => (process.platform === 'darwin' || process.platform === 'win32') ? Electron.clipboard.writeBookmark(title, url) : Electron.clipboard.writeText(url),
    writeText: (text) => Electron.clipboard.writeText(text)
  }
}
