/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { debounce } from '@/widgets/helpers';
import { ActionBar, ActionBarItems, ReactComponent, WidgetReactComponentProps, delete14Svg } from '@/widgets/appModules';
import styles from './widget.module.scss';
import { Settings } from './settings';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createContextMenuFactory, listContextId } from '@/widgets/to-do-list/contextMenu';
import { createActionBarItems } from '@/widgets/to-do-list/actionBar';
import clsx from 'clsx';
import { addItem, deleteItem, editItem, focusItemInput, markComplete, markIncomplete, scrollToItemInput, selectAllInItemInput, setItemEditMode } from '@/widgets/to-do-list/actions';
import { EditingItemState, ToDoListItem, ToDoListState, maxTextLength } from '@/widgets/to-do-list/state';

const dataKey = 'todo';

function WidgetComp({widgetApi, settings}: WidgetReactComponentProps<Settings>) {
  const addItemInputRef = useRef<HTMLInputElement>(null);
  const editItemInputRef = useRef<HTMLInputElement>(null);
  const {updateActionBar, setContextMenuFactory, dataStorage} = widgetApi;
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItemState>(null);
  const [scrollToAddInput, setScrollToAddInput] = useState(false);
  const [toDoList, setToDoList] = useState<ToDoListState>({
    items: [],
    nextItemId: 1
  });

  const getToDoList = useCallback(() => toDoList, [toDoList]);

  const saveData = useMemo(() => debounce((data: ToDoListState) => dataStorage.setJson(dataKey, data), 3000), [dataStorage]);

  const loadData = useCallback(async function () {
    const loadedData = await dataStorage.getJson(dataKey) as ToDoListState|undefined;
    if (typeof loadedData === 'object' && loadedData && Array.isArray(loadedData.items) && typeof loadedData.nextItemId === 'number') {
      const sanitizedData: ToDoListState = {
        items: loadedData.items.map(({id, text, isDone }) => {
          if(typeof id === 'number' && typeof text === 'string' && typeof isDone === 'boolean') {
            return { id, text, isDone }
          } else {
            return undefined;
          }
        }).filter(item => item) as ToDoListItem[],
        nextItemId: loadedData.nextItemId
      }
      setToDoList(sanitizedData);
    }
    setIsLoaded(true);
  }, [dataStorage]);

  useEffect(() => {
    if(!isLoaded) {
      loadData();
    }
  }, [isLoaded, loadData])

  const setToDoListAndSave = useCallback((toDoList: ToDoListState)=>{
    setToDoList(toDoList);
    saveData(toDoList);
  }, [saveData])

  useEffect(() => {
    if (isLoaded) {
      updateActionBar(createActionBarItems(addItemInputRef.current, getToDoList, setToDoListAndSave));
    }
  }, [getToDoList, isLoaded, setToDoListAndSave, updateActionBar]);

  useEffect(() => {
    if (isLoaded) {
      setContextMenuFactory(createContextMenuFactory(addItemInputRef.current, settings, getToDoList, setToDoListAndSave, setEditingItem));
    }
  }, [getToDoList, isLoaded, setContextMenuFactory, setToDoListAndSave, settings]);

  useEffect(() => {
    if (scrollToAddInput && addItemInputRef.current) {
      scrollToItemInput(addItemInputRef.current);
      setScrollToAddInput(false);
    }
  }, [scrollToAddInput])

  useEffect(() => {
    if (editingItem!==null && editItemInputRef.current) {
      focusItemInput(editItemInputRef.current);
      selectAllInItemInput(editItemInputRef.current);
    }
  }, [editingItem])

  const addItemInputBlurHandler: React.FocusEventHandler<HTMLInputElement> = useCallback(e => {
    addItem(e.target.value, getToDoList, setToDoListAndSave);
    e.target.value='';
  }, [getToDoList, setToDoListAndSave])

  const addItemInputKeyDownHandler: React.KeyboardEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.key === 'Enter') {
      addItem((e.target as HTMLInputElement).value, getToDoList, setToDoListAndSave);
      (e.target as HTMLInputElement).value='';
      setScrollToAddInput(true);
    }
  }, [getToDoList, setToDoListAndSave])

  const editItemInputBlurHandler = useCallback((e: React.FocusEvent<HTMLInputElement, Element>, itemId: number) => {
    editItem(itemId, e.target.value, getToDoList, setToDoListAndSave);
    setItemEditMode(null, setEditingItem);
  }, [getToDoList, setToDoListAndSave])

  const editItemInputKeyDownHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>, itemId: number) => {
    if (e.key === 'Enter') {
      editItem(itemId, (e.target as HTMLInputElement).value, getToDoList, setToDoListAndSave);
      setItemEditMode(null, setEditingItem);
    } else if (e.key === 'Escape') {
      setItemEditMode(null, setEditingItem);
    }
  }, [getToDoList, setToDoListAndSave])

  const createDoneActionBarItems: (itemId: number) => ActionBarItems = useCallback((itemId) => [{
    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-ITEM',
    title: 'Delete Item',
    doAction: async () => {
      deleteItem(itemId, getToDoList, setToDoListAndSave);
    }
  }], [getToDoList, setToDoListAndSave])

  return (
    isLoaded
    ? <div className={styles['todo-list-viewport']} data-widget-context={listContextId}>
        <ul
          className={styles['todo-list']}
        >
          {toDoList.items.map(item=>(
            <li
              key={item.id}
              className={clsx(styles['todo-list-item'], item.isDone && styles['is-done'], editingItem === item.id && styles['is-edit-mode'])}
              data-widget-context={item.id}
            >
              <label title={item.text}>
                <span>
                  <input
                    type='checkbox'
                    checked={item.isDone}
                    onChange={
                      _ => item.isDone
                        ? markIncomplete(item.id, getToDoList, setToDoListAndSave)
                        : markComplete(item.id, settings.doneToBottom, getToDoList, setToDoListAndSave)
                    }/>
                </span>
                {editingItem === item.id
                  ? <input
                      type="text"
                      ref={editItemInputRef}
                      className={clsx(styles['todo-list-item-editor'], styles['todo-list-edit-item-editor'])}
                      onBlur={e => editItemInputBlurHandler(e, item.id)}
                      onKeyDown={e => editItemInputKeyDownHandler(e, item.id)}
                      defaultValue={item.text}
                      maxLength={maxTextLength}
                    />
                  : <span>{item.text}</span>
                }
              </label>
              {item.isDone &&
                <ActionBar
                  actionBarItems={createDoneActionBarItems(item.id)}
                  className={styles['done-item-actionbar']}
                ></ActionBar>
              }
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add an item"
          ref={addItemInputRef}
          className={clsx(styles['todo-list-item-editor'], styles['todo-list-add-item-editor'])}
          onBlur={addItemInputBlurHandler}
          onKeyDown={addItemInputKeyDownHandler}
          maxLength={maxTextLength}
        />
      </div>
    : <>Loading To-Do List...</>
  )
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
