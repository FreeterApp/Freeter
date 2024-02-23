/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { createShowContextMenuForTextInputUseCase } from '@/application/useCases/contextMenu/showContextMenuForTextInput';
import { contextMenuForTextInput } from '@/base/contextMenu';

function setup() {
  const contextMenuMock: ContextMenuProvider = {
    show: jest.fn()
  };
  const useCase = createShowContextMenuForTextInputUseCase({ contextMenu: contextMenuMock });
  return {
    useCase,
    contextMenuMock
  }
}

describe('showContextMenuForTextInput()', () => {
  it('should call provider\'s show() with param = menu for text input', async () => {
    const { useCase, contextMenuMock } = setup()

    useCase();

    expect(contextMenuMock.show).toBeCalledTimes(1);
    expect(contextMenuMock.show).toBeCalledWith(contextMenuForTextInput);
  });
})
