/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItemIpc, MenuItemsIpc, MenuItems, MenuItem } from '@common/base/menu';

export function prepareMenuItemsForIpc(menuItems: MenuItems): [menuItemsIpc: MenuItemsIpc, menuItemsByActionId: MenuItem[]] {
  let menuItemsByActionId: MenuItem[] = [];

  function iterate(menuItems: MenuItems): MenuItemsIpc {
    return menuItems.map<MenuItemIpc>(item => {
      const { doAction, submenu, ...rest } = item;

      let actionId: number | undefined;

      if (doAction) {
        menuItemsByActionId.push(item);
        actionId = menuItemsByActionId.length - 1;
      }

      const newSubmenu = submenu ? iterate(submenu) : submenu;

      return {
        ...rest,
        ...((actionId !== undefined) && { actionId }),
        ...(newSubmenu && { submenu: newSubmenu })
      }
    })
  }

  menuItemsByActionId = [];
  const menuItemsIpc = iterate(menuItems);

  return [menuItemsIpc, menuItemsByActionId];
}
