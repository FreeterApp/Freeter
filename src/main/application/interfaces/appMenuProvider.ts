/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItemsIpc } from '@common/base/menu';
import { WebContents } from '@/application/interfaces/webContents';
import { BrowserWindow } from '@/application/interfaces/browserWindow';

export interface AppMenuProvider {
  setMenu: (items: MenuItemsIpc, actionsTarget: WebContents) => void
  setAutoHide: (autoHide: boolean, windowTarget: BrowserWindow) => void
}
