/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { activateAddItemInput, labelAddItem, labelMarkAllIncomplete, markAllIncomplete } from './actions';
import { copyFullTextSvg } from './icons';
import { GetToDoListState, SetToDoListState } from '@/widgets/to-do-list/state';

export function createActionBarItems(elAddItemInput: HTMLInputElement | null, getState: GetToDoListState, setState: SetToDoListState): ActionBarItems {
  return (!elAddItemInput) ? [] : [
    {
      enabled: true,
      icon: copyFullTextSvg,
      id: 'ADD-ITEM',
      title: labelAddItem,
      doAction: async () => activateAddItemInput(elAddItemInput)
    },
    {
      enabled: true,
      icon: copyFullTextSvg,
      id: 'MARK-ALL-INCOMPLETE',
      title: labelMarkAllIncomplete,
      doAction: async () => markAllIncomplete(getState, setState)
    }
  ];
}
