/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItem } from '@common/base/menu';

export function createClickContextMenuItemUseCase() {
  return function clickContextMenuItemUseCase(item: MenuItem): void {
    if (item.doAction) {
      item.doAction();
    }
  }
}

export type ClickContextMenuItemUseCase = ReturnType<typeof createClickContextMenuItemUseCase>;
