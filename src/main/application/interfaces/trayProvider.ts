/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WebContents } from '@/application/interfaces/webContents';
import { MenuItem, MenuItemIpc } from '@common/base/menu';

export interface TrayProvider {
  setMenu: (items: ReadonlyArray<MenuItem | MenuItemIpc>, actionsTarget?: WebContents) => void;
  setMainAction: (action: (() => Promise<void>) | null) => void;
}
