/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { ipcWriteTextIntoClipboardChannel, IpcWriteTextIntoClipboardArgs, IpcWriteTextIntoClipboardRes, ipcWriteBookmarkIntoClipboardChannel, IpcWriteBookmarkIntoClipboardArgs, IpcWriteBookmarkIntoClipboardRes } from '@common/ipc/channels';
import { WriteTextIntoClipboardUseCase } from '@/application/useCases/clipboard/writeTextIntoClipboard';
import { WriteBookmarkIntoClipboardUseCase } from '@/application/useCases/clipboard/writeBookmarkIntoClipboard';

type Deps = {
  writeBookmarkIntoClipboardUseCase: WriteBookmarkIntoClipboardUseCase;
  writeTextIntoClipboardUseCase: WriteTextIntoClipboardUseCase;
}

export function createClipboardControllers({
  writeBookmarkIntoClipboardUseCase,
  writeTextIntoClipboardUseCase,
}: Deps): [
    Controller<IpcWriteBookmarkIntoClipboardArgs, IpcWriteBookmarkIntoClipboardRes>,
    Controller<IpcWriteTextIntoClipboardArgs, IpcWriteTextIntoClipboardRes>,
  ] {
  return [{
    channel: ipcWriteBookmarkIntoClipboardChannel,
    handle: async (_event, title, url) => writeBookmarkIntoClipboardUseCase(title, url)
  }, {
    channel: ipcWriteTextIntoClipboardChannel,
    handle: async (_event, text) => writeTextIntoClipboardUseCase(text)
  }]
}
