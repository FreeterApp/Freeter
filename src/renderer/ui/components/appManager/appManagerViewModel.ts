/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseAppManagerUseCase } from '@/application/useCases/appManager/closeAppManager';
import { AddAppInAppManagerUseCase } from '@/application/useCases/appManager/addAppInAppManager';
import { SaveChangesInAppManagerUseCase } from '@/application/useCases/appManager/saveChangesInAppManager';
import { SwitchAppInAppManagerUseCase } from '@/application/useCases/appManager/switchAppInAppManager';
import { ToggleDeletionInAppManagerUseCase } from '@/application/useCases/appManager/toggleDeletionInAppManager';
import { UpdateAppSettingsInAppManagerUseCase } from '@/application/useCases/appManager/updateAppSettingsInAppManager';
import { UpdateAppsOrderInAppManagerUseCase } from '@/application/useCases/appManager/updateAppsOrderInAppManager';
import { AppSettings } from '@/base/app';
import { UseAppState } from '@/ui/hooks/appState';
import { DragEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { mapIdListToEntityList } from '@/base/entityList';
import { EntityId } from '@/base/entity';
import { AppManagerListItemAppAction } from '@/ui/components/appManager/appManagerList/appManagerListItemViewModel';
import { moveItemInList } from '@/base/list';
import { DuplicateAppInAppManagerUseCase } from '@/application/useCases/appManager/duplicateAppInAppManager';
import { ShowOpenFileDialogUseCase } from '@/application/useCases/dialog/showOpenFileDialog';

type Deps = {
  useAppState: UseAppState;
  addAppInAppManagerUseCase: AddAppInAppManagerUseCase;
  saveChangesInAppManagerUseCase: SaveChangesInAppManagerUseCase;
  switchAppInAppManagerUseCase: SwitchAppInAppManagerUseCase;
  toggleDeletionInAppManagerUseCase: ToggleDeletionInAppManagerUseCase;
  duplicateAppInAppManagerUseCase: DuplicateAppInAppManagerUseCase;
  updateAppsOrderInAppManagerUseCase: UpdateAppsOrderInAppManagerUseCase;
  updateAppSettingsInAppManagerUseCase: UpdateAppSettingsInAppManagerUseCase;
  closeAppManagerUseCase: CloseAppManagerUseCase;
  showOpenFileDialogUseCase: ShowOpenFileDialogUseCase;
}

export function createAppManagerViewModelHook({
  useAppState,
  addAppInAppManagerUseCase,
  saveChangesInAppManagerUseCase,
  switchAppInAppManagerUseCase,
  toggleDeletionInAppManagerUseCase,
  duplicateAppInAppManagerUseCase,
  updateAppSettingsInAppManagerUseCase,
  updateAppsOrderInAppManagerUseCase,
  closeAppManagerUseCase,
  showOpenFileDialogUseCase,
}: Deps) {
  function useViewModel() {
    const {
      currentAppSettings,
      currentAppId,
      deleteAppIds,
      appIds,
      apps,
      renderAppManager,
    } = useAppState(state => {
      const { currentAppId, deleteAppIds, appIds, apps } = state.ui.modalScreens.data.appManager
      let currentAppSettings: AppSettings | null = null;
      const renderAppManager = (deleteAppIds !== null && appIds !== null && apps !== null);
      if (currentAppId && apps) {
        currentAppSettings = apps[currentAppId]?.settings || null;
      }
      return {
        renderAppManager,
        currentAppSettings,
        currentAppId,
        deleteAppIds,
        appIds,
        apps
      }
    })

    const appList = useMemo(() => mapIdListToEntityList(apps || {}, appIds || []), [appIds, apps])

    const [dragState, setDragState] = useState<{
      draggingAppId: EntityId | null;
      draggingOverAppId: EntityId | null;
    } | null>(null);

    const updateSettings = useCallback((updSettings: AppSettings) => {
      updateAppSettingsInAppManagerUseCase(currentAppId, updSettings);
    }, [currentAppId])

    const onOkClick = useCallback(() => {
      saveChangesInAppManagerUseCase();
    }, []);

    const onCancelClick = useCallback(() => {
      closeAppManagerUseCase();
    }, []);

    const onListItemClick = useCallback((_evt: MouseEvent<HTMLElement>, appId: EntityId) => {
      switchAppInAppManagerUseCase(appId)
    }, []);

    const onListItemDragStart = useCallback((evt: DragEvent<HTMLElement>, appId: EntityId) => {
      setDragState({
        draggingAppId: appId,
        draggingOverAppId: null
      })
    }, [])

    const onListItemDragEnd = useCallback((_evt: DragEvent<HTMLElement>, _appId: EntityId) => {
      setDragState(null);
    }, [])

    const onListItemDragEnter = useCallback((_evt: DragEvent<HTMLElement>, appId: EntityId) => {
      if (dragState) {
        setDragState({
          ...dragState,
          draggingOverAppId: appId
        });
      }
    }, [dragState])

    const onListItemDragLeave = useCallback((_evt: DragEvent<HTMLElement>, _appId: EntityId) => {
      if (dragState) {
        setDragState({
          ...dragState,
          draggingOverAppId: null
        });
      }
    }, [dragState])

    const onListItemDragOver = useCallback((evt: DragEvent<HTMLElement>, appId: EntityId) => {
      if (dragState !== null) {
        if (dragState.draggingOverAppId !== appId) {
          setDragState({
            ...dragState,
            draggingOverAppId: appId
          });
        }
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
      }
    }, [dragState])

    const onListItemDrop = useCallback((_evt: DragEvent<HTMLElement>, appId: EntityId) => {
      if (appIds && dragState && dragState.draggingAppId) {
        const { draggingAppId } = dragState;
        const sourceIdx = appIds.indexOf(draggingAppId);
        const targetIdx = appIds.indexOf(appId);
        if (sourceIdx !== -1 && targetIdx !== -1) {
          const newAppIds = moveItemInList(appIds, sourceIdx, targetIdx);
          updateAppsOrderInAppManagerUseCase(newAppIds);
        }
      }
    }, [dragState, appIds])

    const [appAddedTrigger, setAppAddedTrigger] = useState(false);

    const onAddAppClick = useCallback((_evt: MouseEvent<HTMLElement>) => {
      addAppInAppManagerUseCase();
      setAppAddedTrigger(!appAddedTrigger);
    }, [appAddedTrigger]);

    const deleteAppAction: AppManagerListItemAppAction = useCallback((appId) => toggleDeletionInAppManagerUseCase(appId), [])

    const duplicateAppAction: AppManagerListItemAppAction = useCallback((appId) => duplicateAppInAppManagerUseCase(appId), [])


    return {
      renderAppManager,
      currentAppSettings,
      currentAppId,
      deleteAppIds: deleteAppIds || {},
      appList,
      draggingAppId: dragState?.draggingAppId || null,
      draggingOverAppId: dragState?.draggingOverAppId || null,
      appAddedTrigger,
      deleteAppAction,
      duplicateAppAction,
      updateSettings,
      onOkClick,
      onCancelClick,
      onListItemClick,
      onListItemDragStart,
      onListItemDragEnd,
      onListItemDragEnter,
      onListItemDragLeave,
      onListItemDragOver,
      onListItemDrop,
      onAddAppClick,
      showOpenFileDialogUseCase,
    }
  }

  return useViewModel;
}

export type AppManagerViewModelHook = ReturnType<typeof createAppManagerViewModelHook>;
export type AppManagerViewModel = ReturnType<AppManagerViewModelHook>;
