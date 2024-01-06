/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MenuItem } from '@common/base/menu';

export function createClickAppMenuItemUseCase() {
  return function clickAppMenuItemUseCase(item: MenuItem): void {
    if (item.doAction) {
      item.doAction();
    }
  }
}

export type ClickAppMenuItemUseCase = ReturnType<typeof createClickAppMenuItemUseCase>;
