/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarProps } from '@/ui/components/basic/actionBar';
import styles from './projectManagerListItem.module.scss';
import { ProjectManagerListItemProps, useProjectManagerListItemViewModel } from '@/ui/components/projectManager/projectManagerList/projectManagerListItemViewModel';
import clsx from 'clsx';

type Deps = {
  ActionBar: React.FC<ActionBarProps>;
}

export function createProjectManagerListItemComponent({
  ActionBar,
}: Deps) {
  function ProjectManagerListItemComponent(props: ProjectManagerListItemProps) {
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
      <div className={styles['project-list-item']}>
        <button
          className={clsx(styles['project-list-item-button'], isDropArea && styles['is-drop-area'])}
          role="tab"
          aria-selected={isCurrent}
          draggable={true}
          onClick={onClickHandler}
          onDragStart={onDragStartHandler}
          onDragEnd={onDragEndHandler}
          onDragEnter={onDragEnterHandler}
          onDragLeave={onDragLeaveHandler}
          onDragOver={onDragOverHandler}
          onDrop={onDropHandler}
        >{name}</button>
        <ActionBar
          actionBarItems={actionBarItems}
          className={clsx(styles['project-list-item-action-bar'], hasDeletionMark && styles['always-visible'])}
        ></ActionBar>
      </div>
    )
  }

  return ProjectManagerListItemComponent;
}
