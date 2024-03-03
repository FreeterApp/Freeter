/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { createShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { MenuItems } from '@common/base/menu';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

function setup() {
  const contextMenuMock: ContextMenuProvider = {
    show: jest.fn()
  };
  const useCase = createShowContextMenuUseCase({ contextMenu: contextMenuMock });
  return {
    useCase,
    contextMenuMock
  }
}

describe('showContextMenu()', () => {
  it('should call provider\'s show() with specified param', async () => {
    const paramMenuItems: MenuItems = [fixtureMenuItemA()]
    const { useCase, contextMenuMock } = setup()

    useCase(paramMenuItems);

    expect(contextMenuMock.show).toBeCalledTimes(1);
    expect(contextMenuMock.show).toBeCalledWith(paramMenuItems);
  });
})
