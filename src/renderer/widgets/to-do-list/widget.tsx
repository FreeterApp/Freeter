/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { debounce } from '@/widgets/helpers';
import { ActionBar, ActionBarItems, List, ReactComponent, WidgetReactComponentProps, addItemToList, delete14Svg, moveItemInList, removeItemFromList } from '@/widgets/appModules';
import styles from './widget.module.scss';
import { Settings } from './settings';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createContextMenuFactory, textAreaContextId } from '@/widgets/to-do-list/contextMenu';
import { createActionBarItems } from '@/widgets/to-do-list/actionBar';
import clsx from 'clsx';
import { scrollToAddItemInput } from '@/widgets/to-do-list/actions';
import { ToDoListItem, ToDoListState } from '@/widgets/to-do-list/state';

const dataKey = 'todo';

function createToDoListItem(list: ToDoListState, text: string, idx?: number): [ToDoListState, ToDoListItem] {
  const id = list.nextItemId;
  const newItem: ToDoListItem = {
    id,
    text: text.replace(/\s+/g, ' '),
    isDone: false
  }
  const updList: ToDoListState = {
    nextItemId: id+1,
    items: addItemToList(list.items, newItem, idx)
  }
  return [updList, newItem];
}

function WidgetComp({widgetApi, settings}: WidgetReactComponentProps<Settings>) {
  const addItemInputRef = useRef<HTMLInputElement>(null);
  const {doneToBottom} = settings
  const {updateActionBar, setContextMenuFactory, dataStorage} = widgetApi;
  const [isLoaded, setIsLoaded] = useState(false);
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
      // setContextMenuFactory(createContextMenuFactory(textAreaRef.current, widgetApi));
    }
  }, [isLoaded, updateActionBar, setContextMenuFactory, getToDoList, setToDoListAndSave]);

  useEffect(() => {
    if (scrollToAddInput && addItemInputRef.current) {
      scrollToAddItemInput(addItemInputRef.current);
      setScrollToAddInput(false);
    }
  }, [scrollToAddInput])

  const addItem = useCallback((text: string) => {
    if(text) {
      setToDoListAndSave(createToDoListItem(toDoList, text)[0])
    }
  }, [setToDoListAndSave, toDoList])

  const deleteItem = useCallback((id: number) => {
    const idx = toDoList.items.findIndex(item => id===item.id);
    if(idx>-1) {
      setToDoListAndSave({
        ...toDoList,
        items: removeItemFromList(toDoList.items, idx)
      })
    }
  }, [setToDoListAndSave, toDoList])

  const toggleItem = useCallback((id: number) => {
    let updItems: List<ToDoListItem> = toDoList.items.map(item => item.id===id
      ? {...item, isDone: !item.isDone}
      : item)
    if(doneToBottom) {
      const itemIdx = updItems.findIndex(item => item.id===id);
      if(itemIdx>-1 && updItems[itemIdx].isDone) {
        updItems = moveItemInList(updItems, itemIdx, undefined);
      }
    }
    setToDoListAndSave({
      ...toDoList,
      items: updItems
    })
  }, [doneToBottom, setToDoListAndSave, toDoList])

  const addItemInputBlurHandler: React.FocusEventHandler<HTMLInputElement> = useCallback(e => {
    addItem(e.target.value);
    e.target.value='';
  }, [addItem])
  const addItemInputKeyDownHandler: React.KeyboardEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.key === 'Enter') {
      addItem((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).value='';
      setScrollToAddInput(true);
    }
  }, [addItem])

  const createDoneActionBarItems: (itemId: number) => ActionBarItems = useCallback((itemId) => [{
    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-ITEM',
    title: 'Delete Item',
    doAction: async () => {
      deleteItem(itemId);
    }
  }], [deleteItem])


  return (
    isLoaded
    ? <div className={styles['todo-list-viewport']}>
        <ul
          className={styles['todo-list']}
        >
          {toDoList.items.map(item=>(
            <li
              key={item.id}
              className={clsx(styles['todo-list-item'], item.isDone && styles['is-done'])}
            >
              <label title={item.text}>
                <span>
                  <input type='checkbox' checked={item.isDone} onChange={_ => toggleItem(item.id)}/>
                </span>
                <span>
                  {item.text}
                </span>
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
          maxLength={1000}
        />
      </div>
    // ? <textarea
    //     ref={textAreaRef}
    //     className={styles['textarea']}
    //     defaultValue={loadedNote.current}
    //     onChange={handleChange}
    //     placeholder='Write a note here'
    //     data-widget-context={textAreaContextId}
    //   ></textarea>
    : <>Loading To-Do List...</>
  )

  // const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const loadedNote = useRef('');

  // const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
  //   const newNote = e.target.value;
  //   saveNote(newNote)
  // }, [saveNote])
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
