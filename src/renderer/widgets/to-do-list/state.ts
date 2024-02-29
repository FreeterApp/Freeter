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

export type ItemEditorId = 'add-top' | number | 'add-bottom'; // number = item id to edit
export type ActiveItemEditorState = { id: ItemEditorId } | null;

export type GetToDoListState = () => ToDoListState;
export type SetToDoListState = (newState: ToDoListState) => void;

export type SetActiveItemEditorState = (newState: ActiveItemEditorState) => void;
