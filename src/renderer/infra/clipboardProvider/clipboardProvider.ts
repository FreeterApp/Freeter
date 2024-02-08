/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcWriteBookmarkIntoClipboardArgs, ipcWriteBookmarkIntoClipboardChannel, ipcWriteBookmarkIntoClipboardRes, ipcWriteTextIntoClipboardArgs, ipcWriteTextIntoClipboardChannel, ipcWriteTextIntoClipboardRes } from '@common/ipc/channels';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';

export function createClipboardProvider(): ClipboardProvider {
  return {
    writeBookmark: async (title, url) => electronIpcRenderer.invoke<ipcWriteBookmarkIntoClipboardArgs, ipcWriteBookmarkIntoClipboardRes>(
      ipcWriteBookmarkIntoClipboardChannel,
      title,
      url
    ),
    writeText: async (text) => electronIpcRenderer.invoke<ipcWriteTextIntoClipboardArgs, ipcWriteTextIntoClipboardRes>(
      ipcWriteTextIntoClipboardChannel,
      text
    )
  }
}
