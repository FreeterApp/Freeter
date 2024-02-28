/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApi } from '@/widgets/appModules';
import { ToDoListState, SetToDoListState, GetToDoListState } from '@/widgets/to-do-list/state';

export const labelAddItem = 'Add Item';
export const labelMarkAllIncomplete = 'Mark All as Incomplete';
// export const labelUndo = 'Undo';
// export const labelRedo = 'Redo';
// export const labelCut = 'Cut';
// export const labelCopy = 'Copy';
// export const labelPaste = 'Paste';
// export const labelSelectAll = 'Select All';

// export function canCopyFullText() {
//   return true;
// }
export function markAllIncomplete(getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  setState({
    ...state,
    items: state.items.map(item => ({ ...item, isDone: false }))
  })
}

export function markAllComplete(getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  setState({
    ...state,
    items: state.items.map(item => ({ ...item, isDone: true }))
  })
}

export function scrollToAddItemInput(elAddItemInput: HTMLElement) {
  elAddItemInput.scrollIntoView();
}
export function activateAddItemInput(elAddItemInput: HTMLElement) {
  scrollToAddItemInput(elAddItemInput);
  elAddItemInput.focus();
}
