/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBar } from '@/ui/components/basic/actionBar';
import styles from './projectManagerListItem.module.scss';
import { ProjectManagerListItemProps, useProjectManagerListItemViewModel } from '@/ui/components/projectManager/projectManagerList/projectManagerListItemViewModel';
import clsx from 'clsx';

export function ProjectManagerListItem(props: ProjectManagerListItemProps) {
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
  } = useProjectManagerListItemViewModel(props);

  return (
    <a
      className={clsx(styles['project-list-item'], isDropArea && styles['is-drop-area'])}
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
        className={styles['project-list-item-name']}
      >{name}</div>
      <ActionBar
        actionBarItems={actionBarItems}
        className={clsx(styles['project-list-item-action-bar'], hasDeletionMark && styles['always-visible'])}
      ></ActionBar>
    </a>
  )
}
