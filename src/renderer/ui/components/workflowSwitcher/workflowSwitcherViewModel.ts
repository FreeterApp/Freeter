/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DragEndUseCase } from '@/application/useCases/dragDrop/dragEnd';
import { DragLeaveTargetUseCase } from '@/application/useCases/dragDrop/dragLeaveTarget';
import { DragOverWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragOverWorkflowSwitcher';
import { DragWorkflowFromWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dragWorkflowFromWorkflowSwitcher';
import { DropOnWorkflowSwitcherUseCase } from '@/application/useCases/dragDrop/dropOnWorkflowSwitcher';
import { SwitchWorkflowUseCase } from '@/application/useCases/workflowSwitcher/switchWorkflow';
import { EntityId } from '@/base/entity';
import { UseAppState } from '@/ui/hooks/appState';
import { DragEvent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { ItemActionBarItemsFactory } from '@/ui/components/workflowSwitcher/workflowSwitcherItemViewModel';
import { OpenWorkflowSettingsUseCase } from '@/application/useCases/workflowSettings/openWorkflowSettings';
import { ActionBarItems } from '@/base/actionBar';
import { add14Svg, delete14Svg, settings14Svg } from '@/ui/assets/images/appIcons';
import { AddWorkflowUseCase } from '@/application/useCases/workflowSwitcher/addWorkflow';
import { RenameWorkflowUseCase } from '@/application/useCases/workflowSwitcher/renameWorkflow';
import { DeleteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/deleteWorkflow';
import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { MenuItems } from '@common/base/menu';

type Deps = {
  useAppState: UseAppState;
  switchWorkflowUseCase: SwitchWorkflowUseCase;
  dragWorkflowFromWorkflowSwitcherUseCase: DragWorkflowFromWorkflowSwitcherUseCase;
  dragOverWorkflowSwitcherUseCase: DragOverWorkflowSwitcherUseCase;
  dragLeaveTargetUseCase: DragLeaveTargetUseCase;
  dropOnWorkflowSwitcherUseCase: DropOnWorkflowSwitcherUseCase;
  dragEndUseCase: DragEndUseCase;
  openWorkflowSettingsUseCase: OpenWorkflowSettingsUseCase;
  addWorkflowUseCase: AddWorkflowUseCase;
  renameWorkflowUseCase: RenameWorkflowUseCase;
  deleteWorkflowUseCase: DeleteWorkflowUseCase;
  showContextMenuUseCase: ShowContextMenuUseCase;
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
  showContextMenuUseCase,
}: Deps) {
  const createActionBarItemsEditMode: (setItemIdInEditNameMode: (id: string | undefined) => void) => ActionBarItems = (setItemIdInEditNameMode) => [{
    enabled: true,
    icon: add14Svg,
    id: 'ADD-WORKFLOW',
    title: 'Add Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(addWorkflowUseCase());
    }
  }]

  const actionBarItemsViewMode: ActionBarItems = [];

  const createItemActionBarItemsEditMode: ItemActionBarItemsFactory = (id) => [{
    enabled: true,
    icon: settings14Svg,
    id: 'WORKFLOW-SETTINGS',
    title: 'Workflow Settings',
    doAction: async () => {
      openWorkflowSettingsUseCase(id);
    }
  }, {
    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-WORKFLOW',
    title: 'Delete Workflow',
    doAction: async () => {
      deleteWorkflowUseCase(id);
    }
  }]

  const createItemActionBarItemsViewMode: ItemActionBarItemsFactory = () => [];

  const createContextMenuItemsEditMode: (setItemIdInEditNameMode: (id: string | undefined) => void) => MenuItems = (setItemIdInEditNameMode) => [{
    enabled: true,
    label: 'Add Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(addWorkflowUseCase());
    }
  }]

  const contextMenuItemsViewMode: MenuItems = [];

  const createItemContextMenuItemsEditMode: (
    id: EntityId,
    setItemIdInEditNameMode: (id: string | undefined) => void
  ) => MenuItems = (id, setItemIdInEditNameMode) => [{
    enabled: true,
    label: 'Rename Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(id);
    }
  }, {
    enabled: true,
    label: 'Workflow Settings',
    doAction: async () => {
      openWorkflowSettingsUseCase(id);
    }
  }, {
    type: 'separator'
  }, {
    enabled: true,
    label: 'Add Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(addWorkflowUseCase(id));
    }
  }, {
    type: 'separator'
  }, {
    enabled: true,
    label: 'Delete Workflow',
    doAction: async () => {
      deleteWorkflowUseCase(id);
    }
  }]

  const createItemContextMenuItemsViewMode: (id: EntityId) => MenuItems = () => [];


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

    const actionBarItems: ActionBarItems = useMemo(
      () => isEditMode
        ? createActionBarItemsEditMode(setItemIdInEditNameMode)
        : actionBarItemsViewMode,
      [isEditMode]
    );

    const itemActionBarItemsFactory: ItemActionBarItemsFactory = isEditMode ? createItemActionBarItemsEditMode : createItemActionBarItemsViewMode;

    const dontShowActionBar = !!resizingItem || !!dndFrom;

    const onContextMenu: React.MouseEventHandler<HTMLDivElement> = useCallback((_) => {
      const contextMenuItems: MenuItems = isEditMode ? createContextMenuItemsEditMode(setItemIdInEditNameMode) : contextMenuItemsViewMode;
      showContextMenuUseCase(contextMenuItems);
    }, [isEditMode])


    const onItemContextMenu = useCallback((e: MouseEvent<HTMLElement>, itemId: EntityId) => {
      const contextMenuItems: MenuItems =
        isEditMode
          ? createItemContextMenuItemsEditMode(itemId, setItemIdInEditNameMode)
          : createItemContextMenuItemsViewMode(itemId);
      showContextMenuUseCase(contextMenuItems);
    }, [isEditMode])


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
      itemActionBarItemsFactory,
      dontShowActionBar,
      onContextMenu,
      onItemContextMenu,
    }
  }

  return useViewModel;
}

export type WorkflowSwitcherViewModelHook = ReturnType<typeof createWorkflowSwitcherViewModelHook>;
export type WorkflowSwitcherViewModel = ReturnType<WorkflowSwitcherViewModelHook>;
