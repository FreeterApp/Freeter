/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { DragOverWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragOverWorkflowSwitcher';
import { DragWorkflowFromWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragWorkflowFromWorkflowSwitcher';
import { DropOnWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dropOnWorkflowSwitcher';
import { ClickActionBarItemUseCase } from '@/application/useCases/actionBar/clickActionBarItem';
import { SwitchWorkflowUseCase } from '@/application/useCases/workflowSwitcher/switchWorkflow';
import { EntityId } from '@/base/entity';
import { UseAppState } from '@/ui/hooks/appState';
import { DragEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { WorkflowSwitcherItemActionBarActions } from '@/ui/components/workflowSwitcher/workflowSwitcherItemViewModel';
import { OpenWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/openWorkflowSettings';
import { ActionBarItems } from '@/base/actionBar';
import { add14Svg } from '@/ui/assets/images/appIcons';
import { AddWorkflowUseCase } from '@/application/useCases/workflowSwitcher/addWorkflow';
import { RenameWorkflowUseCase } from '@/application/useCases/workflowSwitcher/renameWorkflow';
import { DeleteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/deleteWorkflow';

type Deps = {
  useAppState: UseAppState;
  switchWorkflowUseCase: SwitchWorkflowUseCase;
  dragWorkflowFromWorkflowSwitcherUseCase: DragWorkflowFromWorkflowSwitcherUseCase;
  dragOverWorkflowSwitcherUseCase: DragOverWorkflowSwitcherUseCase;
  dragLeaveTargetUseCase: DragLeaveTargetUseCase;
  dropOnWorkflowSwitcherUseCase: DropOnWorkflowSwitcherUseCase;
  dragEndUseCase: DragEndUseCase;
  clickActionBarItemUseCase: ClickActionBarItemUseCase;
  openWorkflowSettingsUseCase: OpenWorkflowSettingsUseCase;
  addWorkflowUseCase: AddWorkflowUseCase;
  renameWorkflowUseCase: RenameWorkflowUseCase;
  deleteWorkflowUseCase: DeleteWorkflowUseCase;
}

export function createWorkflowSwitcherViewModelHook({
  useAppState,
  switchWorkflowUseCase,
  dragEndUseCase,
  dragLeaveTargetUseCase,
  dragOverWorkflowSwitcherUseCase,
  dragWorkflowFromWorkflowSwitcherUseCase,
  dropOnWorkflowSwitcherUseCase,
  openWorkflowSettingsUseCase,
  addWorkflowUseCase,
  renameWorkflowUseCase,
  deleteWorkflowUseCase,
}: Deps) {
  function useViewModel() {
    const {
      isEditMode,
      currentProjectId,
      currentProject,
      dndTargetListItemId,
      dndFrom,
      resizingItem,
    } = useAppState(state => {
      const { editMode: isEditMode } = state.ui;
      const { currentProjectId } = state.ui.projectSwitcher;
      const currentProject = state.entities.projects[currentProjectId];
      const dndTargetListItemId = state.ui.dragDrop.over?.workflowSwitcher?.workflowId;
      const dndFrom = state.ui.dragDrop.from;
      const resizingItem = state.ui.worktable.resizingItem;
      return {
        isEditMode,
        currentProjectId,
        currentProject,
        dndTargetListItemId,
        dndFrom,
        resizingItem,
      }
    })

    const [itemIdInEditNameMode, setItemIdInEditNameMode] = useState<string | undefined>(undefined);

    const workflows = useAppState.useEntityListIfIdsDefined(state => state.entities.workflows, currentProject?.workflowIds);
    const currentWorkflowId = currentProject?.currentWorkflowId;

    const onItemClick = useCallback((_evt: MouseEvent<HTMLElement>, itemId: EntityId) => {
      if (currentWorkflowId !== itemId) {
        switchWorkflowUseCase(currentProjectId, itemId);
      } else if (isEditMode) {
        setItemIdInEditNameMode(itemId);
      }
    }, [currentProjectId, currentWorkflowId, isEditMode])

    const doDragOver = useCallback((evt: DragEvent<HTMLElement>, itemId: EntityId | null) => {
      const canDrop = dragOverWorkflowSwitcherUseCase(itemId);

      if (canDrop) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
      }
    }, [])

    const onItemDragStart = useCallback((_evt: DragEvent<HTMLElement>, itemId: EntityId) => {
      if (!isEditMode) {
        return;
      }

      if (!currentProject) {
        return;
      }
      const item = currentProject.workflowIds.find(v => v === itemId);
      if (!item) {
        return;
      }
      dragWorkflowFromWorkflowSwitcherUseCase(currentProject.id, itemId);
    }, [isEditMode, currentProject])

    const onItemDragEnd = useCallback((_evt: DragEvent<HTMLElement>, _itemId: EntityId) => {
      dragEndUseCase();
    }, [])

    const onItemDragEnter = useCallback((_evt: DragEvent<HTMLElement>, itemId: EntityId) => {
      dragOverWorkflowSwitcherUseCase(itemId);
    }, [])

    const onItemDragLeave = useCallback((_evt: DragEvent<HTMLElement>, _itemId: EntityId) => {
      dragLeaveTargetUseCase();
    }, [])

    const onItemDragOver = useCallback((evt: DragEvent<HTMLElement>, itemId: EntityId) => {
      doDragOver(evt, itemId);
    }, [doDragOver])

    const onItemDrop = useCallback((_evt: DragEvent<HTMLElement>, itemId: EntityId) => {
      dropOnWorkflowSwitcherUseCase(currentProjectId, itemId);
    }, [currentProjectId])

    const onDragEnter = useCallback((_evt: DragEvent<HTMLElement>) => {
      dragOverWorkflowSwitcherUseCase(null);
    }, [])

    const onDragLeave = useCallback((_evt: DragEvent<HTMLElement>) => {
      dragLeaveTargetUseCase();
    }, [])

    const onDragOver = useCallback((evt: DragEvent<HTMLElement>) => {
      doDragOver(evt, null);
    }, [doDragOver])

    const onDrop = useCallback((_evt: DragEvent<HTMLElement>) => {
      dropOnWorkflowSwitcherUseCase(currentProjectId, null);
    }, [currentProjectId])

    const onItemRename = useCallback((itemId: EntityId, newName: string) => {
      renameWorkflowUseCase(itemId, newName);
    }, [])

    const onFinishEditName = useCallback(() => {
      setItemIdInEditNameMode(undefined);
    }, [])
    const actionBarItemsEditMode: ActionBarItems = useMemo(() => [{
      enabled: true,
      icon: add14Svg,
      id: 'ADD-WORKFLOW',
      title: 'Add Workflow',
      doAction: async () => {
        setItemIdInEditNameMode(addWorkflowUseCase());
      }
    }], [])

    const actionBarItems: ActionBarItems = isEditMode ? actionBarItemsEditMode : [];

    const itemActionBarActions: WorkflowSwitcherItemActionBarActions = useMemo((): WorkflowSwitcherItemActionBarActions => ({
      openSettings: (itemId) => openWorkflowSettingsUseCase(itemId),
      delete: (itemId) => deleteWorkflowUseCase(itemId)
    }), [])

    const dontShowActionBar = !!resizingItem || !!dndFrom;

    return {
      isEditMode,
      itemIdInEditNameMode,
      workflows,
      currentWorkflowId,
      dndTargetListItemId,
      onItemClick,
      onItemDragStart,
      onItemDragEnd,
      onItemDragEnter,
      onItemDragLeave,
      onItemDragOver,
      onItemDrop,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onItemRename,
      onFinishEditName,
      actionBarItems,
      itemActionBarActions,
      dontShowActionBar,
    }
  }

  return useViewModel;
}

export type WorkflowSwitcherViewModelHook = ReturnType<typeof createWorkflowSwitcherViewModelHook>;
export type WorkflowSwitcherViewModel = ReturnType<WorkflowSwitcherViewModelHook>;
