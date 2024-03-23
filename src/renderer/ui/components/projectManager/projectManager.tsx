/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProjectManagerViewModelHook } from '@/ui/components/projectManager/projectManagerViewModel';
import clsx from 'clsx';
import styles from './projectManager.module.scss';
import settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';
import { ProjectManagerSettings } from '@/ui/components/projectManager/projectManagerSettings';
import { ProjectManagerList } from '@/ui/components/projectManager/projectManagerList';
import { memo } from 'react';

type Deps = {
  useProjectManagerViewModel: ProjectManagerViewModelHook;
}

export function createProjectManagerComponent({
  useProjectManagerViewModel,
}: Deps) {
  function ProjectManager() {

    const {
      renderProjectManager,
      currentProjectSettings,
      draggingOverProjectId,
      updateSettings,
      onOkClick,
      onCancelClick,
      onListItemClick,
      onListItemDragEnd,
      onListItemDragEnter,
      onListItemDragLeave,
      onListItemDragOver,
      onListItemDragStart,
      onListItemDrop,
      onAddProjectClick,
      currentProjectId,
      deleteProjectIds,
      projectList,
      projectAddedTrigger,
      deleteProjectAction,
      duplicateProjectAction,
    } = useProjectManagerViewModel();

    if (renderProjectManager) {
      return (<SettingsScreen title='Projects' onOkClick={onOkClick} onCancelClick={onCancelClick}>
        <div className={styles['project-list']}>
          <ProjectManagerList
            currentProjectId={currentProjectId}
            draggingOverProjectId={draggingOverProjectId}
            onAddProjectClick={onAddProjectClick}
            onListItemClick={onListItemClick}
            onListItemDragEnd={onListItemDragEnd}
            onListItemDragEnter={onListItemDragEnter}
            onListItemDragLeave={onListItemDragLeave}
            onListItemDragOver={onListItemDragOver}
            onListItemDragStart={onListItemDragStart}
            onListItemDrop={onListItemDrop}
            projectList={projectList}
            deleteProjectAction={deleteProjectAction}
            deleteProjectIds={deleteProjectIds}
            duplicateProjectAction={duplicateProjectAction}
          ></ProjectManagerList>
        </div>
        <div className={clsx(settingsScreenStyles['settings-screen-panel'], styles['settings-editor'])}>
          <ProjectManagerSettings
            settings={currentProjectSettings}
            updateSettings={updateSettings}
            projectAddedTrigger={projectAddedTrigger}
          ></ProjectManagerSettings>
        </div>
      </SettingsScreen>)
    } else {
      return null;
    }
  }

  return memo(ProjectManager);
}

export type ProjectManagerComponent = ReturnType<typeof createProjectManagerComponent>;
