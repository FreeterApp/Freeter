/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { createPopupContextMenuUseCase } from '@/application/useCases/contextMenu/popupContextMenu';
import { MenuItems } from '@common/base/menu';
import { fixtureMenuItemA } from '@testscommon/base/fixtures/menu';

const providerRetVal = 999;

function setup() {
  const contextMenuProviderMock: ContextMenuProvider = {
    popup: jest.fn(async () => providerRetVal)
  }
  const useCase = createPopupContextMenuUseCase({
    contextMenuProvider: contextMenuProviderMock
  });
  return {
    contextMenuProviderMock,
    useCase
  }
}

describe('popupContextMenuUseCase()', () => {
  it('should call popup() of contextMenuProvider with right params and return a right val', async () => {
    const testItems: MenuItems = [fixtureMenuItemA()];
    const { useCase, contextMenuProviderMock } = setup()

    const res = await useCase(testItems);

    expect(contextMenuProviderMock.popup).toBeCalledTimes(1);
    expect(contextMenuProviderMock.popup).toBeCalledWith(testItems);
    expect(res).toBe(providerRetVal);
  });
})
