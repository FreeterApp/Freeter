/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { labelAddItemTop, labelMarkAllIncomplete, markAllIncomplete, activateItemEditor } from './actions';
import { copyFullTextSvg } from './icons';
import { GetToDoListState, SetActiveItemEditorState, SetToDoListState } from '@/widgets/to-do-list/state';

export function createActionBarItems(
  getToDoListState: GetToDoListState,
  setToDoListState: SetToDoListState,
  setActiveItemEditorState: SetActiveItemEditorState
): ActionBarItems {
  return [
    {
      enabled: true,
      icon: copyFullTextSvg,
      id: 'ADD-ITEM-AT-TOP',
      title: labelAddItemTop,
      doAction: async () => activateItemEditor('add-top', setActiveItemEditorState)
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
