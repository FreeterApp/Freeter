/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { List, addItemToList, moveItemInList, removeItemFromList } from '@/widgets/appModules';
import { SetToDoListState, GetToDoListState, ToDoListItem, ToDoListState, SetActiveItemEditorState, ItemEditorId } from '@/widgets/to-do-list/state';

export const labelAddItemTop = 'Add Item at Top';
export const labelAddItemBottom = 'Add Item at Bottom';
export const labelMarkAllIncomplete = 'Mark All as Incomplete';
export const labelMarkAllComplete = 'Mark All as Complete';
export const labelMarkIncomplete = 'Mark as Incomplete';
export const labelMarkComplete = 'Mark as Complete';
export const labelEditItem = 'Edit Item';
export const labelDeleteItem = 'Delete Item';
export const labelDeleteCompleted = 'Delete Completed Items';

function createToDoListItem(list: ToDoListState, text: string, idx?: number): [ToDoListState, ToDoListItem] {
  const id = list.nextItemId;
  const newItem: ToDoListItem = {
    id,
    text: text.replace(/\s+/g, ' '),
    isDone: false
  }
  const updList: ToDoListState = {
    nextItemId: id + 1,
    items: addItemToList(list.items, newItem, idx)
  }
  return [updList, newItem];
}

export function addItem(text: string, atTop: boolean, getState: GetToDoListState, setState: SetToDoListState) {
  if (text) {
    setState(createToDoListItem(getState(), text, atTop ? 0 : undefined)[0])
  }
}

export function editItem(id: number, text: string, getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  setState({
    ...state,
    items: state.items.map(item => item.id === id ? { ...item, text } : item)
  })
}

export function deleteItem(id: number, getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  const idx = state.items.findIndex(item => id === item.id);
  if (idx > -1) {
    setState({
      ...state,
      items: removeItemFromList(state.items, idx)
    })
  }
}

export function deleteCompleted(getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  setState({
    ...state,
    items: state.items.filter(item => !item.isDone)
  })
}

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

export function markIncomplete(itemId: number, getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  setState({
    ...state,
    items: state.items.map(item => (item.id === itemId ? { ...item, isDone: false } : item))
  })
}

export function markComplete(itemId: number, toBottom: boolean, getState: GetToDoListState, setState: SetToDoListState) {
  const state = getState();
  let updItems: List<ToDoListItem> = state.items.map(item => (item.id === itemId ? { ...item, isDone: true } : item));
  if (toBottom) {
    const itemIdx = updItems.findIndex(item => item.id === itemId);
    if (itemIdx > -1) {
      updItems = moveItemInList(updItems, itemIdx, undefined);
    }
  }
  setState({
    ...state,
    items: updItems
  })
}

export function activateItemEditor(id: ItemEditorId, setActiveItemEditorState: SetActiveItemEditorState) {
  setActiveItemEditorState({ id });
}
