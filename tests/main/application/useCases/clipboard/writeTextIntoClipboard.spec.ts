/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';
import { createWriteTextIntoClipboardUseCase } from '@/application/useCases/clipboard/writeTextIntoClipboard';

function setup() {
  const clipboardProviderMock: ClipboardProvider = {
    writeBookmark: jest.fn(),
    writeText: jest.fn()
  }
  const useCase = createWriteTextIntoClipboardUseCase({
    clipboardProvider: clipboardProviderMock
  });
  return {
    clipboardProviderMock: clipboardProviderMock,
    useCase
  }
}

describe('writeTextIntoClipboardUseCase()', () => {
  it('should call writeText() of clipboardProvider with right params', () => {
    const testText = 'test text'
    const { useCase, clipboardProviderMock } = setup()

    useCase(testText);

    expect(clipboardProviderMock.writeText).toBeCalledTimes(1);
    expect(clipboardProviderMock.writeText).toBeCalledWith(testText);
  });
})
