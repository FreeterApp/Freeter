/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItemsIpc } from '@common/base/menu';

export interface ContextMenuProvider {
  popup: (items: MenuItemsIpc) => Promise<number | undefined>;
}
