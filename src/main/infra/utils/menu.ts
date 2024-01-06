/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import Electron from 'electron';
import { MenuItem, MenuItemIpc, MenuItems, MenuItemsIpc } from '@common/base/menu';

function prepareElectronMenu(items: MenuItems): Electron.MenuItemConstructorOptions[] {
  return items.map(item => {
    const {
      doAction,
      submenu,
      ...rest
    } = item;
    return {
      click: doAction,
      ...(submenu ? { submenu: prepareElectronMenu(submenu) } : {}),
      ...rest
    }
  })
}

export type OnActionItemClick = (actionId: number) => void;
function prepareElectronMenuFromIpc(items: MenuItemsIpc, onActionItemClick: OnActionItemClick): Electron.MenuItemConstructorOptions[] {
  return items.map(item => {
    const {
      actionId,
      submenu,
      ...rest
    } = item;
    return {
      click: actionId !== undefined ? () => onActionItemClick(actionId) : undefined,
      ...(submenu ? { submenu: prepareElectronMenuFromIpc(submenu, onActionItemClick) } : {}),
      ...rest
    }
  })
}

function prepareElectronMenuFromMenuItemsAndIpc(
  items: ReadonlyArray<MenuItem | MenuItemIpc>,
  onActionItemClick: OnActionItemClick
): Electron.MenuItemConstructorOptions[] {
  return items.map(item => {
    const {
      actionId,
      doAction,
      submenu,
      ...rest
    } = item as MenuItem & MenuItemIpc;
    return {
      click:
        doAction
          ? doAction
          : (
            actionId !== undefined
              ? () => onActionItemClick(actionId)
              : undefined
          ),
      ...(submenu ? { submenu: prepareElectronMenuFromIpc(submenu, onActionItemClick) } : {}),
      ...rest
    }
  })
}

export function createElectronMenuFromMenuItems(items: MenuItems) {
  return Electron.Menu.buildFromTemplate(prepareElectronMenu(items))
}

export function createElectronMenuFromMenuItemsIpc(items: MenuItemsIpc, onActionItemClick: OnActionItemClick) {
  return Electron.Menu.buildFromTemplate(prepareElectronMenuFromIpc(items, onActionItemClick))
}

export function createElectronMenuFromMenuItemsAndIpc(items: ReadonlyArray<MenuItem | MenuItemIpc>, onIpcActionItemClick: OnActionItemClick) {
  return Electron.Menu.buildFromTemplate(prepareElectronMenuFromMenuItemsAndIpc(items, onIpcActionItemClick))
}

