/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcWriteBookmarkIntoClipboardChannel, ipcWriteTextIntoClipboardChannel } from '@common/ipc/channels';
import { createClipboardControllers } from '@/controllers/clipboard';
import { fixtureIpcMainEvent } from '@tests/infra/fixtures/ipcMain';

function setup() {
  const writeBookmarkIntoClipboardUseCase = jest.fn();
  const writeTextIntoClipboardUseCase = jest.fn();

  const [
    writeBookmarkIntoClipboardController,
    writeTextIntoClipboardController,
  ] = createClipboardControllers({
    writeBookmarkIntoClipboardUseCase,
    writeTextIntoClipboardUseCase,
  })

  return {
    writeBookmarkIntoClipboardController,
    writeBookmarkIntoClipboardUseCase,

    writeTextIntoClipboardUseCase,
    writeTextIntoClipboardController,
  }
}

describe('ClipboardControllers', () => {
  describe('writeBookmarkIntoClipboard', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().writeBookmarkIntoClipboardController;

      expect(channel).toBe(ipcWriteBookmarkIntoClipboardChannel)
    })

    it('should call a right usecase with right params', () => {
      const testTile = 'test title';
      const testUrl = 'test://url';

      const { writeBookmarkIntoClipboardController, writeBookmarkIntoClipboardUseCase } = setup();
      const { handle } = writeBookmarkIntoClipboardController;
      const event = fixtureIpcMainEvent();

      handle(event, testTile, testUrl);

      expect(writeBookmarkIntoClipboardUseCase).toBeCalledTimes(1);
      expect(writeBookmarkIntoClipboardUseCase).toBeCalledWith(testTile, testUrl);
    });
  })

  describe('writeTextIntoClipboard', () => {
    it('should have a right channel name', () => {
      const { channel } = setup().writeTextIntoClipboardController;

      expect(channel).toBe(ipcWriteTextIntoClipboardChannel)
    })

    it('should call a right usecase with right params', () => {
      const testText = 'test text';

      const { writeTextIntoClipboardController, writeTextIntoClipboardUseCase } = setup();
      const { handle } = writeTextIntoClipboardController;
      const event = fixtureIpcMainEvent();

      handle(event, testText);

      expect(writeTextIntoClipboardUseCase).toBeCalledTimes(1);
      expect(writeTextIntoClipboardUseCase).toBeCalledWith(testText);
    });
  })
})
