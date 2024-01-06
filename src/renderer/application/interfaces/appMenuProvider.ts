/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItems } from '@common/base/menu';

export interface AppMenuProvider {
  setMenu: (items: MenuItems) => Promise<void>;
  setAutoHide: (autoHide: boolean) => Promise<void>;
}
