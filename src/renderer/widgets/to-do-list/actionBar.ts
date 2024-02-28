/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { labelAddItemTop, labelMarkAllIncomplete, markAllIncomplete, showEditor } from './actions';
import { copyFullTextSvg } from './icons';
import { GetToDoListState, SetEditorVisibilityState, SetToDoListState } from '@/widgets/to-do-list/state';

export function createActionBarItems(
  getToDoListState: GetToDoListState,
  setToDoListState: SetToDoListState,
  setEditingItemState: SetEditorVisibilityState
): ActionBarItems {
  return [
    {
      enabled: true,
      icon: copyFullTextSvg,
      id: 'ADD-ITEM-AT-TOP',
      title: labelAddItemTop,
      doAction: async () => showEditor('add-top', setEditingItemState)
    },
    {
      enabled: true,
      icon: copyFullTextSvg,
      id: 'MARK-ALL-INCOMPLETE',
      title: labelMarkAllIncomplete,
      doAction: async () => markAllIncomplete(getToDoListState, setToDoListState)
    }
  ];
}
