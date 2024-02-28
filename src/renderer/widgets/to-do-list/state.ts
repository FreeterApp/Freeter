import { List } from '@/base/list';

export const maxTextLength = 1000;

export interface ToDoListItem {
  id: number;
  text: string;
  isDone: boolean;
}

export interface ToDoListState {
  items: List<ToDoListItem>;
  nextItemId: number;
}

export type EditingItemState = number | null;

export type GetToDoListState = () => ToDoListState;
export type SetToDoListState = (newState: ToDoListState) => void;

export type SetEditingItemState = (newState: EditingItemState) => void;
