/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppManagerViewModelHook } from '@/ui/components/appManager/appManagerViewModel';
import clsx from 'clsx';
import styles from './appManager.module.scss';
import settingsScreenStyles from '@/ui/components/basic/settingsScreen/settingsScreen.module.scss'
import { SettingsScreen } from '@/ui/components/basic/settingsScreen/settingsScreen';
import { AppManagerSettings } from '@/ui/components/appManager/appManagerSettings';
import { AppManagerList } from '@/ui/components/appManager/appManagerList';
import { memo } from 'react';

type Deps = {
  useAppManagerViewModel: AppManagerViewModelHook;
}

export function createAppManagerComponent({
  useAppManagerViewModel,
}: Deps) {
  function AppManager() {

    const {
      renderAppManager,
      currentAppSettings,
      draggingOverAppId,
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
      onAddAppClick,
      currentAppId,
      deleteAppIds,
      appList,
      appAddedTrigger,
      deleteAppAction,
      duplicateAppAction,
      showOpenFileDialogUseCase,
    } = useAppManagerViewModel();

    if (renderAppManager) {
      return (<SettingsScreen title='Apps' onOkClick={onOkClick} onCancelClick={onCancelClick}>
        <div className={styles['app-list']}>
          <AppManagerList
            currentAppId={currentAppId}
            draggingOverAppId={draggingOverAppId}
            onAddAppClick={onAddAppClick}
            onListItemClick={onListItemClick}
            onListItemDragEnd={onListItemDragEnd}
            onListItemDragEnter={onListItemDragEnter}
            onListItemDragLeave={onListItemDragLeave}
            onListItemDragOver={onListItemDragOver}
            onListItemDragStart={onListItemDragStart}
            onListItemDrop={onListItemDrop}
            appList={appList}
            deleteAppAction={deleteAppAction}
            deleteAppIds={deleteAppIds}
            duplicateAppAction={duplicateAppAction}
          ></AppManagerList>
        </div>
        <div className={clsx(settingsScreenStyles['settings-screen-panel'], styles['settings-editor'])}>
          <AppManagerSettings
            settings={currentAppSettings}
            updateSettings={updateSettings}
            appAddedTrigger={appAddedTrigger}
            showOpenFileDialogUseCase={showOpenFileDialogUseCase}
          ></AppManagerSettings>
        </div>
      </SettingsScreen>)
    } else {
      return null;
    }
  }

  return memo(AppManager);
}

export type AppManagerComponent = ReturnType<typeof createAppManagerComponent>;
