/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetAppMenuChannel, ipcClickAppMenuActionChannel, ipcSetAppMenuAutoHideChannel } from '@common/ipc/channels';
import { MenuItemsIpc, MenuItems } from '@common/base/menu';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { createAppMenuProvider } from '@/infra/appMenuProvider/appMenuProvider';
import { electronIpcRenderer } from '@/infra/globals';
import { fixtureMenuItemA, fixtureMenuItemB, fixtureMenuItemC } from '@testscommon/base/fixtures/menu';

jest.mock('@/infra/globals');

function setup() {
  const clickAppMenuItemUseCase = jest.fn();
  const appMenuProvider = createAppMenuProvider({ clickAppMenuItemUseCase });

  return {
    clickAppMenuItemUseCase,
    appMenuProvider
  }
}

describe('AppMenuProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should setup a listener on "click-app-menu-action" channel', async () => {
    setup();

    expect(electronIpcRenderer.on).toBeCalledTimes(1);
    expect((<jest.MockedFunction<typeof electronIpcRenderer.on>>electronIpcRenderer.on).mock.calls[0][0]).toBe(ipcClickAppMenuActionChannel);
  })

  describe('setMenu', () => {
    it('should send a message to the main process via "set-app-menu" channel with right args', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined, enabled: true, icon: 'icon', label: 'label', role: 'undo', type: 'normal' }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ doAction: async () => undefined }),
      ];
      const expectItems: MenuItemsIpc = prepareMenuItemsForIpc(testItems)[0];
      const { appMenuProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await appMenuProvider.setMenu(testItems);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcSetAppMenuChannel, expectItems);
    })

    it('should call clickAppMenuItemUseCase with the right params, when the main process sends a message via "click-app-menu-action" channel', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ label: 'TEST-ACTION', doAction: async () => undefined }),
      ];
      const { appMenuProvider, clickAppMenuItemUseCase } = setup();
      await appMenuProvider.setMenu(testItems);
      const onListener = (<jest.MockedFunction<typeof electronIpcRenderer.on>>electronIpcRenderer.on).mock.calls[0][1]
      onListener(1);

      expect(clickAppMenuItemUseCase).toBeCalledTimes(1);
      expect(clickAppMenuItemUseCase).toBeCalledWith(testItems[2]);
    })
  })

  describe('setAutoHide', () => {
    it('should send a message to the main process via "set-app-menu-auto-hide" channel with right args', async () => {
      const { appMenuProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await appMenuProvider.setAutoHide(true);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcSetAppMenuAutoHideChannel, true);

      await appMenuProvider.setAutoHide(false);

      expect(electronIpcRenderer.invoke).toHaveBeenNthCalledWith(2, ipcSetAppMenuAutoHideChannel, false);
    })
  })
})
