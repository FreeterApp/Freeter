/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { GetToDoListState, SetEditingItemState, SetToDoListState } from '@/widgets/to-do-list/state';
import { activateItemInput, deleteCompleted, deleteItem, setItemEditMode, labelAddItem, labelDeleteCompleted, labelDeleteItem, labelEditItem, labelMarkAllComplete, labelMarkAllIncomplete, labelMarkComplete, labelMarkIncomplete, markAllComplete, markAllIncomplete, markComplete, markIncomplete } from './actions';
import { WidgetContextMenuFactory, WidgetMenuItem } from '@/widgets/appModules';
import { Settings } from '@/widgets/to-do-list/settings';

export const listContextId = 'list';
export function createContextMenuFactory(
  elAddItemInput: HTMLInputElement | null,
  settings: Settings,
  getToDoListState: GetToDoListState,
  setToDoListState: SetToDoListState,
  setEditingItemState: SetEditingItemState
): WidgetContextMenuFactory {
  return (contextId) => {
    let ctxMenuItems: WidgetMenuItem[] = []
    if (elAddItemInput) {
      const ctxCommonItems: WidgetMenuItem[] = [
        {
          label: labelAddItem,
          doAction: async () => activateItemInput(elAddItemInput)
        },
        { type: 'separator' },
        {
          label: labelMarkAllIncomplete,
          doAction: async () => markAllIncomplete(getToDoListState, setToDoListState)
        },
        {
          label: labelMarkAllComplete,
          doAction: async () => markAllComplete(getToDoListState, setToDoListState)
        },
        { type: 'separator' },
        {
          label: labelDeleteCompleted,
          doAction: async () => deleteCompleted(getToDoListState, setToDoListState)
        },
      ]
      if (contextId === listContextId) {
        ctxMenuItems = ctxCommonItems;
      } else {
        const itemId = Number(contextId);
        const { items } = getToDoListState();
        if (!isNaN(itemId)) {
          const itemIdx = items.findIndex(item => item.id === itemId);
          if (itemIdx > -1) {
            const item = items[itemIdx];

            ctxMenuItems = [
              {
                label: item.isDone ? labelMarkIncomplete : labelMarkComplete,
                doAction: item.isDone
                  ? async () => markIncomplete(itemId, getToDoListState, setToDoListState)
                  : async () => markComplete(itemId, settings.doneToBottom, getToDoListState, setToDoListState)
              }, {
                label: labelEditItem,
                doAction: async () => setItemEditMode(itemId, setEditingItemState)
              }, {
                label: labelDeleteItem,
                doAction: async () => deleteItem(itemId, getToDoListState, setToDoListState)
              },
              { type: 'separator' },
              ...ctxCommonItems
            ];
          }
        }
      }
    }

    return ctxMenuItems;
  }
}
