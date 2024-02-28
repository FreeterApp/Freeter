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

export type EditorVisibilityState = number | 'add-top' | null;

export type GetToDoListState = () => ToDoListState;
export type SetToDoListState = (newState: ToDoListState) => void;

export type SetEditorVisibilityState = (newState: EditorVisibilityState) => void;
