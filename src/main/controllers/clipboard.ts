/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Controller } from '@/controllers/controller';
import { ipcWriteTextIntoClipboardChannel, ipcWriteTextIntoClipboardArgs, ipcWriteTextIntoClipboardRes, ipcWriteBookmarkIntoClipboardChannel, ipcWriteBookmarkIntoClipboardArgs, ipcWriteBookmarkIntoClipboardRes } from '@common/ipc/channels';
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
    Controller<ipcWriteBookmarkIntoClipboardArgs, ipcWriteBookmarkIntoClipboardRes>,
    Controller<ipcWriteTextIntoClipboardArgs, ipcWriteTextIntoClipboardRes>,
  ] {
  return [{
    channel: ipcWriteBookmarkIntoClipboardChannel,
    handle: async (_event, title, url) => writeBookmarkIntoClipboardUseCase(title, url)
  }, {
    channel: ipcWriteTextIntoClipboardChannel,
    handle: async (_event, text) => writeTextIntoClipboardUseCase(text)
  }]
}
