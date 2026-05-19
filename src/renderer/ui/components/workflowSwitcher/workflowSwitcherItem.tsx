/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import clsx from 'clsx';
import styles from './workflowSwitcher.module.scss';
import {WorkflowSwitcherItemProps, useWorkflowSwitcherItemViewModel} from './workflowSwitcherItemViewModel';
import { ActionBar } from '@/ui/components/basic/actionBar';

export function WorkflowSwitcherItem (props: WorkflowSwitcherItemProps) {
  const {
    // id,
    name,
    isCurrent,
    isEditMode,
    isDropArea,
    onClickHandler,
    onContextMenuHandler,
    onDragStartHandler,
    onDragEndHandler,
    onDragEnterHandler,
    onDragLeaveHandler,
    onDragOverHandler,
    onDropHandler,
    actionBarItems,
    isEditNameMode,
    onNameBlurHandler,
    onNameChangeHandler,
    onNameKeyDownHandler,
    refNameInput
  } = useWorkflowSwitcherItemViewModel(props);

  return (
    <div
      className={styles['workflow-switcher-item']}
      onContextMenu={onContextMenuHandler}
    >
      <button
        role="tab"
        aria-selected={isCurrent}
        className={clsx(styles['workflow-switcher-item-button'], isDropArea && styles['is-drop-area'])}
        draggable={isEditMode}
        onClick={onClickHandler}
        onDragStart={onDragStartHandler}
        onDragEnd={onDragEndHandler}
        onDragEnter={onDragEnterHandler}
        onDragLeave={onDragLeaveHandler}
        onDragOver={onDragOverHandler}
        onDrop={onDropHandler}
      >
        {name}
      </button>
      {
        isEditNameMode ?
        <input
          ref={refNameInput}
          className={styles['workflow-switcher-item-name-editor']}
          value={name}
          onBlur={onNameBlurHandler}
          onChange={onNameChangeHandler}
          onKeyDown={onNameKeyDownHandler}
          type="text"
          title="name"
        /> :
        <ActionBar
          actionBarItems={actionBarItems}
          className={styles['workflow-switcher-item-action-bar']}
        ></ActionBar>
      }
    </div>
  )
}
