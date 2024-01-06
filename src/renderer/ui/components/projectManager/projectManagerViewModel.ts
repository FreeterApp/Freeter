/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CloseProjectManagerUseCase } from '@/application/useCases/projectManager/closeProjectManager';
import { AddProjectInProjectManagerUseCase } from '@/application/useCases/projectManager/addProjectInProjectManager';
import { SaveChangesInProjectManagerUseCase } from '@/application/useCases/projectManager/saveChangesInProjectManager';
import { SwitchProjectInProjectManagerUseCase } from '@/application/useCases/projectManager/switchProjectInProjectManager';
import { ToggleDeletionInProjectManagerUseCase } from '@/application/useCases/projectManager/toggleDeletionInProjectManager';
import { UpdateProjectSettingsInProjectManagerUseCase } from '@/application/useCases/projectManager/updateProjectSettingsInProjectManager';
import { UpdateProjectsOrderInProjectManagerUseCase } from '@/application/useCases/projectManager/updateProjectsOrderInProjectManager';
import { ProjectSettings } from '@/base/project';
import { UseAppState } from '@/ui/hooks/appState';
import { DragEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { mapIdListToEntityList } from '@/base/entityList';
import { EntityId } from '@/base/entity';
import { ProjectManagerListItemDeleteProjectAction } from '@/ui/components/projectManager/projectManagerList/projectManagerListItemViewModel';
import { moveItemInList } from '@/base/list';

type Deps = {
  useAppState: UseAppState;
  addProjectInProjectManagerUseCase: AddProjectInProjectManagerUseCase;
  saveChangesInProjectManagerUseCase: SaveChangesInProjectManagerUseCase;
  switchProjectInProjectManagerUseCase: SwitchProjectInProjectManagerUseCase;
  toggleDeletionInProjectManagerUseCase: ToggleDeletionInProjectManagerUseCase;
  updateProjectsOrderInProjectManagerUseCase: UpdateProjectsOrderInProjectManagerUseCase;
  updateProjectSettingsInProjectManagerUseCase: UpdateProjectSettingsInProjectManagerUseCase;
  closeProjectManagerUseCase: CloseProjectManagerUseCase;
}

export function createProjectManagerViewModelHook({
  useAppState,
  addProjectInProjectManagerUseCase,
  saveChangesInProjectManagerUseCase,
  switchProjectInProjectManagerUseCase,
  toggleDeletionInProjectManagerUseCase,
  updateProjectSettingsInProjectManagerUseCase,
  updateProjectsOrderInProjectManagerUseCase,
  closeProjectManagerUseCase,
}: Deps) {
  function useViewModel() {
    const {
      currentProjectSettings,
      currentProjectId,
      deleteProjectIds,
      projectIds,
      projects,
      renderProjectManager,
    } = useAppState(state => {
      const { currentProjectId, deleteProjectIds, projectIds, projects } = state.ui.projectManager
      let currentProjectSettings: ProjectSettings | null = null;
      const renderProjectManager = (deleteProjectIds !== null && projectIds !== null && projects !== null);
      if (currentProjectId && projects) {
        currentProjectSettings = projects[currentProjectId]?.settings || null;
      }
      return {
        renderProjectManager,
        currentProjectSettings,
        currentProjectId,
        deleteProjectIds: deleteProjectIds || {},
        projectIds,
        projects
      }
    })

    const projectList = useMemo(() => mapIdListToEntityList(projects || {}, projectIds || []), [projectIds, projects])

    const [dragState, setDragState] = useState<{
      draggingProjectId: EntityId | null;
      draggingOverProjectId: EntityId | null;
    } | null>(null);

    const updateSettings = useCallback((updSettings: ProjectSettings) => {
      updateProjectSettingsInProjectManagerUseCase(currentProjectId, updSettings);
    }, [currentProjectId])

    const onOkClick = useCallback(() => {
      saveChangesInProjectManagerUseCase();
    }, []);

    const onCancelClick = useCallback(() => {
      closeProjectManagerUseCase();
    }, []);

    const onListItemClick = useCallback((_evt: MouseEvent<HTMLElement>, projectId: EntityId) => {
      switchProjectInProjectManagerUseCase(projectId)
    }, []);

    const onListItemDragStart = useCallback((evt: DragEvent<HTMLElement>, projectId: EntityId) => {
      setDragState({
        draggingProjectId: projectId,
        draggingOverProjectId: null
      })
    }, [])

    const onListItemDragEnd = useCallback((_evt: DragEvent<HTMLElement>, _projectId: EntityId) => {
      setDragState(null);
    }, [])

    const onListItemDragEnter = useCallback((_evt: DragEvent<HTMLElement>, projectId: EntityId) => {
      if (dragState) {
        setDragState({
          ...dragState,
          draggingOverProjectId: projectId
        });
      }
    }, [dragState])

    const onListItemDragLeave = useCallback((_evt: DragEvent<HTMLElement>, _projectId: EntityId) => {
      if (dragState) {
        setDragState({
          ...dragState,
          draggingOverProjectId: null
        });
      }
    }, [dragState])

    const onListItemDragOver = useCallback((evt: DragEvent<HTMLElement>, projectId: EntityId) => {
      if (dragState !== null) {
        if (dragState.draggingOverProjectId !== projectId) {
          setDragState({
            ...dragState,
            draggingOverProjectId: projectId
          });
        }
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
      }
    }, [dragState])

    const onListItemDrop = useCallback((_evt: DragEvent<HTMLElement>, projectId: EntityId) => {
      if (projectIds && dragState && dragState.draggingProjectId) {
        const { draggingProjectId } = dragState;
        const sourceIdx = projectIds.indexOf(draggingProjectId);
        const targetIdx = projectIds.indexOf(projectId);
        if (sourceIdx !== -1 && targetIdx !== -1) {
          const newProjectIds = moveItemInList(projectIds, sourceIdx, targetIdx);
          updateProjectsOrderInProjectManagerUseCase(newProjectIds);
        }
      }
    }, [dragState, projectIds])

    const [projectAddedTrigger, setProjectAddedTrigger] = useState(false);

    const onAddProjectClick = useCallback((_evt: MouseEvent<HTMLElement>) => {
      addProjectInProjectManagerUseCase();
      setProjectAddedTrigger(!projectAddedTrigger);
    }, [projectAddedTrigger]);

    const deleteProjectAction: ProjectManagerListItemDeleteProjectAction = useCallback((projectId) => toggleDeletionInProjectManagerUseCase(projectId), [])


    return {
      renderProjectManager,
      currentProjectSettings,
      currentProjectId,
      deleteProjectIds,
      projectList,
      draggingProjectId: dragState?.draggingProjectId || null,
      draggingOverProjectId: dragState?.draggingOverProjectId || null,
      projectAddedTrigger,
      deleteProjectAction,
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
      onAddProjectClick,
    }
  }

  return useViewModel;
}

export type ProjectManagerViewModelHook = ReturnType<typeof createProjectManagerViewModelHook>;
export type ProjectManagerViewModel = ReturnType<ProjectManagerViewModelHook>;
