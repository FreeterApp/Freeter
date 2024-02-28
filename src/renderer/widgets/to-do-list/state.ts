import { List } from '@/base/list';

export interface ToDoListItem {
  id: number;
  text: string;
  isDone: boolean;
}

export interface ToDoListState {
  items: List<ToDoListItem>;
  nextItemId: number;
}

export type GetToDoListState = () => ToDoListState;
export type SetToDoListState = (newState: ToDoListState) => void;
