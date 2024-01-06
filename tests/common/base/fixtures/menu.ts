/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItem, MenuItemIpc } from '@common/base/menu';
import { makeFixture } from '@utils/makeFixture';

const menuItems: MenuItem[] = [{
  label: 'M-A'
}, {
  label: 'M-B'
}, {
  label: 'M-C'
}, {
  label: 'M-D'
}]

const menuItemsIpc: MenuItemIpc[] = [{
  label: 'M-A'
}, {
  label: 'M-B'
}, {
  label: 'M-C'
}, {
  label: 'M-D'
}]

export const fixtureMenuItemA = makeFixture(menuItems[0]);
export const fixtureMenuItemB = makeFixture(menuItems[1]);
export const fixtureMenuItemC = makeFixture(menuItems[2]);
export const fixtureMenuItemD = makeFixture(menuItems[3]);

export const fixtureMenuItemIpcA = makeFixture(menuItemsIpc[0]);
export const fixtureMenuItemIpcB = makeFixture(menuItemsIpc[1]);
export const fixtureMenuItemIpcC = makeFixture(menuItemsIpc[2]);
export const fixtureMenuItemIpcD = makeFixture(menuItemsIpc[3]);
