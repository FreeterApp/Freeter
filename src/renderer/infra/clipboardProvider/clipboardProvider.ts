/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IpcWriteBookmarkIntoClipboardArgs, ipcWriteBookmarkIntoClipboardChannel, IpcWriteBookmarkIntoClipboardRes, IpcWriteTextIntoClipboardArgs, ipcWriteTextIntoClipboardChannel, IpcWriteTextIntoClipboardRes } from '@common/ipc/channels';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';

export function createClipboardProvider(): ClipboardProvider {
  return {
    writeBookmark: async (title, url) => electronIpcRenderer.invoke<IpcWriteBookmarkIntoClipboardArgs, IpcWriteBookmarkIntoClipboardRes>(
      ipcWriteBookmarkIntoClipboardChannel,
      title,
      url
    ),
    writeText: async (text) => electronIpcRenderer.invoke<IpcWriteTextIntoClipboardArgs, IpcWriteTextIntoClipboardRes>(
      ipcWriteTextIntoClipboardChannel,
      text
    )
  }
}
