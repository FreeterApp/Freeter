/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBar } from '@/ui/components/basic/actionBar';
import styles from './appManagerListItem.module.scss';
import { AppManagerListItemProps, useAppManagerListItemViewModel } from '@/ui/components/appManager/appManagerList/appManagerListItemViewModel';
import clsx from 'clsx';

export function AppManagerListItem(props: AppManagerListItemProps) {
  const {
    isCurrent,
    hasDeletionMark,
    onClickHandler,
    isDropArea,
    onDragEndHandler,
    onDragEnterHandler,
    onDragLeaveHandler,
    onDragOverHandler,
    onDragStartHandler,
    onDropHandler,
    name,
    actionBarItems,
  } = useAppManagerListItemViewModel(props);

  return (
    <a
      className={clsx(styles['app-list-item'], isDropArea && styles['is-drop-area'])}
      role="tab"
      href=""
      aria-selected={isCurrent}
      draggable={true}
      onClick={onClickHandler}
      onDragStart={onDragStartHandler}
      onDragEnd={onDragEndHandler}
      onDragEnter={onDragEnterHandler}
      onDragLeave={onDragLeaveHandler}
      onDragOver={onDragOverHandler}
      onDrop={onDropHandler}
    >
      <div
        className={styles['app-list-item-name']}
      >{name}</div>
      <ActionBar
        actionBarItems={actionBarItems}
        className={clsx(styles['app-list-item-action-bar'], hasDeletionMark && styles['always-visible'])}
      ></ActionBar>
    </a>
  )
}
