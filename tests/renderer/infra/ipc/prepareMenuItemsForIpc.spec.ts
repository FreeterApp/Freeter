/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItemIpc, MenuItemsIpc, MenuItems } from '@common/base/menu';
import { prepareMenuItemsForIpc } from '@/infra/ipc/prepareMenuItemsForIpc';
import { fixtureMenuItemA, fixtureMenuItemB, fixtureMenuItemC, fixtureMenuItemD } from '@testscommon/base/fixtures/menu';

describe('Menu', () => {
  describe('prepareMenuItemsForIpc()', () => {
    it('should correctly prepare menuItemsIpc and menuItemsByActionId for IPC', () => {
      const testItemA = fixtureMenuItemA({ doAction: async () => undefined });
      const testItemB = fixtureMenuItemB({ doAction: async () => undefined, enabled: true, icon: 'icon', label: 'label', role: 'undo', type: 'normal', submenu: [testItemA] })
      const testItemC = fixtureMenuItemC({});
      const testItemD = fixtureMenuItemD({ doAction: async () => undefined });
      const testItems: MenuItems = [testItemB, testItemC, testItemD];
      const { doAction: itemAAction, ...itemAProps } = testItemA;
      const { doAction: itemBAction, ...itemBProps } = testItemB;
      const { doAction: itemCAction, ...itemCProps } = testItemC;
      const { doAction: itemDAction, ...itemDProps } = testItemD;
      const expectItemIpcA: MenuItemIpc = { actionId: 1, ...itemAProps }
      const expectItemIpcB: MenuItemIpc = { actionId: 0, ...itemBProps, submenu: [expectItemIpcA] }
      const expectItemIpcC: MenuItemIpc = { ...itemCProps }
      const expectItemIpcD: MenuItemIpc = { actionId: 2, ...itemDProps }
      const expectItemsIpc: MenuItemsIpc = [expectItemIpcB, expectItemIpcC, expectItemIpcD];
      const expectMenuItemsByActionId = [testItemB, testItemA, testItemD];

      const [gotItemsIpc, gotItemsByActionId] = prepareMenuItemsForIpc(testItems);

      expect(gotItemsIpc).toEqual(expectItemsIpc);
      expect(gotItemsByActionId).toEqual(expectMenuItemsByActionId);
    })
  })
})
