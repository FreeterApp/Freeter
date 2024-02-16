/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

// import { AppStore } from '@/application/interfaces/store';
import { EntityId } from '@/base/entity';
import { findEntityOnList } from '@/base/entityList';
import { ActionBarItems } from '@/base/actionBar';

export function clickActionBarItemUseCase(actionBarItems: ActionBarItems, actionBarItemId: EntityId) {
  const actionBarItem = findEntityOnList(actionBarItems, actionBarItemId);
  if (actionBarItem) {
    actionBarItem.doAction();
  }
}
