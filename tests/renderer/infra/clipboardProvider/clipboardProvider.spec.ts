/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcWriteBookmarkIntoClipboardChannel, ipcWriteTextIntoClipboardChannel } from '@common/ipc/channels';
import { createClipboardProvider } from '@/infra/clipboardProvider/clipboardProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';

jest.mock('@/infra/mainApi/mainApi');

describe('ClipboardProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('writeBookmark', () => {
    it('should send a message to the main process via a right ipc channel with right args', async () => {
      const testTitle = 'test title';
      const testUrl = 'test://url';
      const clipboardProvider = createClipboardProvider();

      await clipboardProvider.writeBookmark(testTitle, testUrl);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWriteBookmarkIntoClipboardChannel, testTitle, testUrl);
    })
  })

  describe('writeText', () => {
    it('should send a message to the main process via a right ipc channel with right args', async () => {
      const testText = 'test text';
      const clipboardProvider = createClipboardProvider();

      await clipboardProvider.writeText(testText);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcWriteTextIntoClipboardChannel, testText);
    })
  })
});
