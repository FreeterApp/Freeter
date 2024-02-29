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
import { addItem, deleteItem, editItem, markComplete, markIncomplete } from '@/widgets/to-do-list/actions';
import { ActiveItemEditorState, ToDoListItem, ToDoListState, maxTextLength } from '@/widgets/to-do-list/state';
import { focusItemInput, scrollToItemInput, selectAllInItemInput } from '@/widgets/to-do-list/dom';

const dataKey = 'todo';

function WidgetComp({widgetApi, settings}: WidgetReactComponentProps<Settings>) {
  const addItemTopInputRef = useRef<HTMLInputElement>(null);
  const addItemBottomInputRef = useRef<HTMLInputElement>(null);
  const editItemInputRef = useRef<HTMLInputElement>(null);
  const {updateActionBar, setContextMenuFactory, dataStorage} = widgetApi;
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeItemEditorState, setActiveItemEditorState] = useState<ActiveItemEditorState>(null);
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
      updateActionBar(createActionBarItems(getToDoList, setToDoListAndSave, setActiveItemEditorState));
    }
  }, [getToDoList, isLoaded, setToDoListAndSave, updateActionBar]);

  useEffect(() => {
    if (isLoaded) {
      setContextMenuFactory(
        createContextMenuFactory(settings, getToDoList, setToDoListAndSave, setActiveItemEditorState)
        );
    }
  }, [getToDoList, isLoaded, setContextMenuFactory, setToDoListAndSave, settings]);

  useEffect(() => {
    if (activeItemEditorState!==null) {
      if (activeItemEditorState.id==='add-top' && addItemTopInputRef.current) {
        focusItemInput(addItemTopInputRef.current);
        scrollToItemInput(addItemTopInputRef.current);
      } else if (activeItemEditorState.id==='add-bottom' && addItemBottomInputRef.current) {
        focusItemInput(addItemBottomInputRef.current);
        scrollToItemInput(addItemBottomInputRef.current);
      } else if (editItemInputRef.current) {
        focusItemInput(editItemInputRef.current);
        selectAllInItemInput(editItemInputRef.current);
      }
    }
  }, [activeItemEditorState])

  const addItemInputBlurHandler = useCallback((e: React.FocusEvent<HTMLInputElement, Element>, isTop: boolean) => {
    addItem(e.target.value, isTop, getToDoList, setToDoListAndSave);
    e.target.value='';
    if(isTop) {
      setActiveItemEditorState(null);
    }
  }, [getToDoList, setToDoListAndSave])

  const addItemInputKeyDownHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>, isTop: boolean) => {
    if (e.key === 'Enter') {
      addItem((e.target as HTMLInputElement).value, isTop, getToDoList, setToDoListAndSave);
      (e.target as HTMLInputElement).value='';
      setActiveItemEditorState(isTop ? {id: 'add-top'} : {id: 'add-bottom'});
    } else if (e.key === 'Escape') {
      (e.target as HTMLInputElement).value='';
      setActiveItemEditorState(null);
    }
  }, [getToDoList, setToDoListAndSave])

  const editItemInputBlurHandler = useCallback((e: React.FocusEvent<HTMLInputElement, Element>, itemId: number) => {
    editItem(itemId, e.target.value, getToDoList, setToDoListAndSave);
    setActiveItemEditorState(null);
  }, [getToDoList, setToDoListAndSave])

  const editItemInputKeyDownHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>, itemId: number) => {
    if (e.key === 'Enter') {
      editItem(itemId, (e.target as HTMLInputElement).value, getToDoList, setToDoListAndSave);
      setActiveItemEditorState(null);
    } else if (e.key === 'Escape') {
      (e.target as HTMLInputElement).value='';
      setActiveItemEditorState(null);
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
        {activeItemEditorState?.id==='add-top' && <input
          type="text"
          placeholder="Add an item"
          ref={addItemTopInputRef}
          className={clsx(styles['todo-list-item-editor'], styles['todo-list-add-item-editor'], styles['is-top'])}
          onBlur={e=>addItemInputBlurHandler(e, true)}
          onKeyDown={e=>addItemInputKeyDownHandler(e, true)}
          maxLength={maxTextLength}
        />}
        <ul
          className={styles['todo-list']}
        >
          {toDoList.items.map(item=>(
            <li
              key={item.id}
              className={clsx(styles['todo-list-item'], item.isDone && styles['is-done'], activeItemEditorState?.id === item.id && styles['is-editor'])}
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
                {activeItemEditorState?.id === item.id
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
          ref={addItemBottomInputRef}
          className={clsx(styles['todo-list-item-editor'], styles['todo-list-add-item-editor'])}
          onBlur={e=>addItemInputBlurHandler(e, false)}
          onKeyDown={e=>addItemInputKeyDownHandler(e, false)}
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
