/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcPopupOsContextMenuChannel } from '@common/ipc/channels';
import { MenuItemsIpc, MenuItems } from '@common/base/menu';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { createOsContextMenuProvider } from '@/infra/contextMenuProvider/osContextMenuProvider';
import { electronIpcRenderer } from '@/infra/mainApi/mainApi';
import { fixtureMenuItemA, fixtureMenuItemB, fixtureMenuItemC } from '@testscommon/base/fixtures/menu';

jest.mock('@/infra/mainApi/mainApi');

function setup() {
  const clickContextMenuItemUseCase = jest.fn();
  const contextMenuProvider = createOsContextMenuProvider({ clickContextMenuItemUseCase });

  return {
    clickContextMenuItemUseCase,
    contextMenuProvider
  }
}

describe('osContextMenuProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  describe('show', () => {
    it('should not send a message to the main process via "popup-os-context-menu" channel, when items is empty', async () => {
      const testItems: MenuItems = [];
      const { contextMenuProvider } = setup();

      await contextMenuProvider.show(testItems);

      expect(electronIpcRenderer.invoke).not.toBeCalled();
    })

    it('should send a message to the main process via "popup-os-context-menu" channel with right args, when items is not empty', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined, enabled: true, icon: 'icon', label: 'label', role: 'undo', type: 'normal' }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ doAction: async () => undefined }),
      ];
      const expectItems: MenuItemsIpc = prepareMenuItemsForIpc(testItems)[0];
      const { contextMenuProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await contextMenuProvider.show(testItems);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcPopupOsContextMenuChannel, expectItems);
    })

    it('should not call clickContextMenuItemUseCase if a message sent to the main process via "popup-os-context-menu" channel returns undefined', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ doAction: async () => undefined }),
      ];
      const { contextMenuProvider, clickContextMenuItemUseCase } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await contextMenuProvider.show(testItems);

      expect(clickContextMenuItemUseCase).not.toBeCalled();
    })

    it('should call clickContextMenuItemUseCase with a right menuItem if a message sent to the main process via "popup-os-context-menu" channel returns a MenuItem action id', async () => {
      const testItem = fixtureMenuItemC({ doAction: async () => undefined });
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined }),
        fixtureMenuItemB({}),
        testItem,
      ];
      const expectActionIdForTestItem = 1;
      const { contextMenuProvider, clickContextMenuItemUseCase } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(expectActionIdForTestItem);

      await contextMenuProvider.show(testItems);

      expect(clickContextMenuItemUseCase).toBeCalledTimes(1);
      expect(clickContextMenuItemUseCase).toBeCalledWith(testItem);
    })
  })

})
