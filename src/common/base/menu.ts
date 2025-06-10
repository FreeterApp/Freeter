/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export const menuItemRoles = ['undo', 'redo', 'cut', 'copy', 'paste', 'pasteAndMatchStyle', 'delete', 'selectAll', 'toggleSpellChecker', 'togglefullscreen', 'window', 'minimize', 'close', 'help', 'about', 'services', 'hide', 'hideOthers', 'unhide', 'quit', 'startSpeaking', 'stopSpeaking', 'appMenu', 'fileMenu', 'editMenu', 'viewMenu', 'shareMenu', 'recentDocuments', 'toggleTabBar', 'selectNextTab', 'selectPreviousTab', 'mergeAllWindows', 'clearRecentDocuments', 'moveTabToNewWindow', 'windowMenu', 'reload', 'forceReload', 'toggleDevTools'] as const;
export type MenuItemRole = typeof menuItemRoles[number];

export const menuItemTypes = ['normal', 'separator', 'submenu', 'checkbox', 'radio'] as const;
export type MenuItemType = typeof menuItemTypes[number];

export interface MenuItemCommon<T extends MenuItemCommon<T>> {
  readonly accelerator?: string;
  readonly label?: string;
  readonly role?: MenuItemRole;
  readonly type?: MenuItemType;
  readonly checked?: boolean;
  readonly icon?: string;
  readonly enabled?: boolean;
  readonly submenu?: ReadonlyArray<T>;
}

export interface MenuItemIpc extends MenuItemCommon<MenuItemIpc> {
  readonly actionId?: number;
}

export type MenuItemsIpc = ReadonlyArray<MenuItemIpc>;

export type MenuAction = () => Promise<void>;

export interface MenuItem extends MenuItemCommon<MenuItem> {
  readonly doAction?: MenuAction;
}

export type MenuItems = ReadonlyArray<MenuItem>;

export type MenuActions = ReadonlyArray<MenuAction>;
