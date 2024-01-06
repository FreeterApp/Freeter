/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItemsIpc } from '@common/base/menu';
import { ProcessInfo } from '@common/base/process';
import { makeIpcChannelName } from '@common/ipc/ipc';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';

export const ipcAppDataStorageGetTextChannel = makeIpcChannelName('app-data-storage-get-text');
export type IpcAppDataStorageGetTextArgs = [key: string];
export type IpcAppDataStorageGetTextRes = string | undefined;

export const ipcAppDataStorageSetTextChannel = makeIpcChannelName('app-data-storage-set-text');
export type IpcAppDataStorageSetTextArgs = [key: string, text: string];
export type IpcAppDataStorageSetTextRes = void;

export const ipcAppDataStorageDeleteChannel = makeIpcChannelName('app-data-storage-delete');
export type IpcAppDataStorageDeleteArgs = [key: string];
export type IpcAppDataStorageDeleteRes = void;

export const ipcAppDataStorageClearChannel = makeIpcChannelName('app-data-storage-clear');
export type IpcAppDataStorageClearArgs = [];
export type IpcAppDataStorageClearRes = void;

export const ipcAppDataStorageGetKeysChannel = makeIpcChannelName('app-data-storage-get-keys');
export type IpcAppDataStorageGetKeysArgs = [];
export type IpcAppDataStorageGetKeysRes = string[];

export const ipcWidgetDataStorageGetTextChannel = makeIpcChannelName('widget-data-storage-get-text');
export type IpcWidgetDataStorageGetTextArgs = [widgetId: string, key: string];
export type IpcWidgetDataStorageGetTextRes = string | undefined;

export const ipcWidgetDataStorageSetTextChannel = makeIpcChannelName('widget-data-storage-set-text');
export type IpcWidgetDataStorageSetTextArgs = [widgetId: string, key: string, text: string];
export type IpcWidgetDataStorageSetTextRes = void;

export const ipcWidgetDataStorageDeleteChannel = makeIpcChannelName('widget-data-storage-delete');
export type IpcWidgetDataStorageDeleteArgs = [widgetId: string, key: string];
export type IpcWidgetDataStorageDeleteRes = void;

export const ipcWidgetDataStorageClearChannel = makeIpcChannelName('widget-data-storage-clear');
export type IpcWidgetDataStorageClearArgs = [widgetId: string];
export type IpcWidgetDataStorageClearRes = void;

export const ipcWidgetDataStorageGetKeysChannel = makeIpcChannelName('widget-data-storage-get-keys');
export type IpcWidgetDataStorageGetKeysArgs = [widgetId: string];
export type IpcWidgetDataStorageGetKeysRes = string[];

export const ipcPopupOsContextMenuChannel = makeIpcChannelName('popup-os-context-menu');
export type IpcPopupOsContextMenuArgs = [menuItems: MenuItemsIpc];
export type IpcPopupOsContextMenuRes = number | undefined;

export const ipcShellOpenExternalUrlChannel = makeIpcChannelName('shell-open-external-url');
export type ipcShellOpenExternalUrlArgs = [url: string];
export type ipcShellOpenExternalUrlRes = void;

export const ipcWriteBookmarkIntoClipboardChannel = makeIpcChannelName('write-bookmark-into-clipboard');
export type ipcWriteBookmarkIntoClipboardArgs = [title: string, url: string];
export type ipcWriteBookmarkIntoClipboardRes = void;

export const ipcWriteTextIntoClipboardChannel = makeIpcChannelName('write-text-into-clipboard');
export type ipcWriteTextIntoClipboardArgs = [text: string];
export type ipcWriteTextIntoClipboardRes = void;

export const ipcGetProcessInfoChannel = makeIpcChannelName('get-process-info');
export type ipcGetProcessInfoArgs = [];
export type ipcGetProcessInfoRes = ProcessInfo;

export const ipcShowOsMessageBoxChannel = makeIpcChannelName('show-os-message-box');
export type IpcShowOsMessageBoxArgs = [config: MessageBoxConfig];
export type IpcShowOsMessageBoxRes = MessageBoxResult;

export const ipcSetAppMenuChannel = makeIpcChannelName('set-app-menu');
export type IpcSetAppMenuArgs = [menuItems: MenuItemsIpc];
export type IpcSetAppMenuRes = void;


export const ipcSetAppMenuAutoHideChannel = makeIpcChannelName('set-app-menu-auto-hide');
export type IpcSetAppMenuAutoHideArgs = [autoHide: boolean];
export type IpcSetAppMenuAutoHideRes = void;

export const ipcClickAppMenuActionChannel = makeIpcChannelName('click-app-menu-action');
export type IpcClickAppMenuActionArgs = [actionId: number];

export const ipcSetMainShortcutChannel = makeIpcChannelName('set-main-shortcut');
export type IpcSetMainShortcutArgs = [accelerator: string];
export type IpcSetMainShortcutRes = boolean;

export const ipcSetTrayMenuChannel = makeIpcChannelName('set-tray-menu');
export type IpcSetTrayMenuArgs = [menuItems: MenuItemsIpc];
export type IpcSetTrayMenuRes = void;

export const ipcClickTrayMenuActionChannel = makeIpcChannelName('click-tray-menu-action');
export type IpcClickTrayMenuActionArgs = [actionId: number];

export const ipcShowBrowserWindowChannel = makeIpcChannelName('show-browser-window');
export type IpcShowBrowserWindowArgs = [];
export type IpcShowBrowserWindowRes = void;
