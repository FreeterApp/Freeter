/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import styles from './projectManagerList.module.scss';
import { Button } from '@/ui/components/basic/button';
import { ProjectManagerListItem } from '@/ui/components/projectManager/projectManagerList/projectManagerListItem';
import { ProjectManagerListProps, useProjectManagerListViewModel } from '@/ui/components/projectManager/projectManagerList/projectManagerListViewModel';

export function ProjectManagerList(props: ProjectManagerListProps) {
  const {
    projectList,
    currentProjectId,
    draggingOverProjectId,
    onListItemClick,
    onListItemDragEnd,
    onListItemDragEnter,
    onListItemDragLeave,
    onListItemDragOver,
    onListItemDragStart,
    onListItemDrop,
    onAddProjectClick,
    deleteProjectAction,
    deleteProjectIds,
    duplicateProjectAction,
  } = useProjectManagerListViewModel(props);

  return (<div role="tablist">
    {projectList.map(item=>(
      <ProjectManagerListItem
        isCurrent={currentProjectId===item.id}
        isDropArea={draggingOverProjectId===item.id}
        hasDeletionMark={deleteProjectIds[item.id]}
        onClick={onListItemClick}
        onDragEnd={onListItemDragEnd}
        onDragEnter={onListItemDragEnter}
        onDragLeave={onListItemDragLeave}
        onDragOver={onListItemDragOver}
        onDragStart={onListItemDragStart}
        onDrop={onListItemDrop}
        project={item}
        key={item.id}
        deleteProjectAction={deleteProjectAction}
        duplicateProjectAction={duplicateProjectAction}
      ></ProjectManagerListItem>
    ))}
    <div className={styles['project-list-actions']}>
      <Button
        caption='Add Project'
        onClick={e=>onAddProjectClick(e)}
        size='L'
        primary={true}
      ></Button>
    </div>
  </div>)
}
