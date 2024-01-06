/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';
import { createWriteBookmarkIntoClipboardUseCase } from '@/application/useCases/clipboard/writeBookmarkIntoClipboard';

function setup() {
  const clipboardProviderMock: ClipboardProvider = {
    writeBookmark: jest.fn(),
    writeText: jest.fn()
  }
  const useCase = createWriteBookmarkIntoClipboardUseCase({
    clipboardProvider: clipboardProviderMock
  });
  return {
    clipboardProviderMock: clipboardProviderMock,
    useCase
  }
}

describe('writeBookmarkIntoClipboardUseCase()', () => {
  it('should call writeBookmark() of clipboardProvider with right params', () => {
    const testTitle = 'test title';
    const testUrl = 'test://url';
    const { useCase, clipboardProviderMock } = setup()

    useCase(testTitle, testUrl);

    expect(clipboardProviderMock.writeBookmark).toBeCalledTimes(1);
    expect(clipboardProviderMock.writeBookmark).toBeCalledWith(testTitle, testUrl);
  });
})
