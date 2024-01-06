/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ipcSetTrayMenuChannel, ipcClickTrayMenuActionChannel } from '@common/ipc/channels';
import { MenuItemsIpc, MenuItems } from '@common/base/menu';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { createTrayMenuProvider } from '@/infra/trayMenuProvider/trayMenuProvider';
import { electronIpcRenderer } from '@/infra/globals';
import { fixtureMenuItemA, fixtureMenuItemB, fixtureMenuItemC } from '@testscommon/base/fixtures/menu';

jest.mock('@/infra/globals');

function setup() {
  const clickTrayMenuItemUseCase = jest.fn();
  const trayMenuProvider = createTrayMenuProvider({ clickTrayMenuItemUseCase });

  return {
    clickTrayMenuItemUseCase,
    trayMenuProvider
  }
}

describe('TrayMenuProvider', () => {
  beforeEach(() => jest.resetAllMocks())

  it('should setup a listener on "click-tray-menu-action" channel', async () => {
    setup();

    expect(electronIpcRenderer.on).toBeCalledTimes(1);
    expect((<jest.MockedFunction<typeof electronIpcRenderer.on>>electronIpcRenderer.on).mock.calls[0][0]).toBe(ipcClickTrayMenuActionChannel);
  })

  describe('setMenu', () => {
    it('should send a message to the main process via "set-tray-menu" channel with right args', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined, enabled: true, icon: 'icon', label: 'label', role: 'undo', type: 'normal' }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ doAction: async () => undefined }),
      ];
      const expectItems: MenuItemsIpc = prepareMenuItemsForIpc(testItems)[0];
      const { trayMenuProvider } = setup();
      (<jest.MockedFunction<typeof electronIpcRenderer.invoke>>electronIpcRenderer.invoke).mockResolvedValue(undefined);

      await trayMenuProvider.setMenu(testItems);

      expect(electronIpcRenderer.invoke).toBeCalledTimes(1);
      expect(electronIpcRenderer.invoke).toBeCalledWith(ipcSetTrayMenuChannel, expectItems);
    })

    it('should call clickTrayMenuItemUseCase with the right params, when the main process sends a message via "click-tray-menu-action" channel', async () => {
      const testItems: MenuItems = [
        fixtureMenuItemA({ doAction: async () => undefined }),
        fixtureMenuItemB({}),
        fixtureMenuItemC({ label: 'TEST-ACTION', doAction: async () => undefined }),
      ];
      const { trayMenuProvider, clickTrayMenuItemUseCase } = setup();
      await trayMenuProvider.setMenu(testItems);
      const onListener = (<jest.MockedFunction<typeof electronIpcRenderer.on>>electronIpcRenderer.on).mock.calls[0][1]
      onListener(1);

      expect(clickTrayMenuItemUseCase).toBeCalledTimes(1);
      expect(clickTrayMenuItemUseCase).toBeCalledWith(testItems[2]);
    })
  })
})
