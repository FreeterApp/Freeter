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
import { add14Svg, delete14Svg, more14Svg } from '@/ui/assets/images/appIcons';
import { AddWorkflowUseCase } from '@/application/useCases/workflowSwitcher/addWorkflow';
import { RenameWorkflowUseCase } from '@/application/useCases/workflowSwitcher/renameWorkflow';
import { DeleteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/deleteWorkflow';
import { ShowContextMenuUseCase } from '@/application/useCases/contextMenu/showContextMenu';
import { MenuItem, MenuItems } from '@common/base/menu';
import { EntityList, mapIdListToEntityList } from '@/base/entityList';
import { CopiedEntitiesItem } from '@/base/state/ui';
import { Workflow } from '@/base/workflow';
import { WorkflowEntityDeps } from '@/base/state/entities';
import { PasteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/pasteWorkflow';
import { CopyWorkflowUseCase } from '@/application/useCases/workflow/copyWorkflow';

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
  copyWorkflowUseCase: CopyWorkflowUseCase;
  pasteWorkflowUseCase: PasteWorkflowUseCase;
}

export function createWorkflowSwitcherViewModelHook({
  useAppState,
  switchWorkflowUseCase,
  dragEndUseCase,
  dragLeaveTargetUseCase,
  dragOverWorkflowSwitcherUseCase,
  dragWorkflowFromWorkflowSwitcherUseCase,
  dropOnWorkflowSwitcherUseCase,
  // openWorkflowSettingsUseCase,
  addWorkflowUseCase,
  renameWorkflowUseCase,
  deleteWorkflowUseCase,
  showContextMenuUseCase,
  copyWorkflowUseCase,
  pasteWorkflowUseCase,
}: Deps) {
  function buildPasteMenuItems(
    copiedWorkflows: EntityList<CopiedEntitiesItem<Workflow, WorkflowEntityDeps>>,
    posByWorkflowId?: string
  ): MenuItem[] {
    return copiedWorkflows.length === 0
      ? [{ enabled: false, label: 'No workflows to paste' }]
      : copiedWorkflows.map(item => ({
        enabled: true,
        label: item.entity.settings.name,
        doAction: async () => {
          pasteWorkflowUseCase(item.id, posByWorkflowId);
        }
      }))
  }
  function showMoreActions(copiedWorkflows: EntityList<CopiedEntitiesItem<Workflow, WorkflowEntityDeps>>) {
    showContextMenuUseCase([
      {
        enabled: true,
        label: 'Paste Workflow...',
        submenu: buildPasteMenuItems(copiedWorkflows)
      }
    ])
  }

  const createActionBarItemsEditMode: (
    setItemIdInEditNameMode: (id: string | undefined) => void,
    copiedWorkflows: EntityList<CopiedEntitiesItem<Workflow, WorkflowEntityDeps>>
  ) => ActionBarItems = (setItemIdInEditNameMode, copiedWorkflows) => [{
    enabled: true,
    icon: add14Svg,
    id: 'ADD-WORKFLOW',
    title: 'Add Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(addWorkflowUseCase());
    }
  }, {
    enabled: true,
    icon: more14Svg,
    id: 'MORE-ACTIONS',
    title: 'More Actions...',
    doAction: async () => {
      showMoreActions(copiedWorkflows);
    }
  }]

  const actionBarItemsViewMode: ActionBarItems = [];

  function showMoreActionsForItem(
    id: EntityId,
    setItemIdInEditNameMode: (id: string | undefined) => void,
  ) {
    showContextMenuUseCase([
      {
        enabled: true,
        label: 'Rename Workflow',
        doAction: async () => {
          setItemIdInEditNameMode(id);
        }
      },
      { type: 'separator' },
      {
        enabled: true,
        label: 'Copy Workflow',
        doAction: async () => {
          copyWorkflowUseCase(id)
        }
      }
    ])
  }
  const createItemActionBarItemsEditMode: (
    id: EntityId,
    setItemIdInEditNameMode: (id: string | undefined) => void
  ) => ActionBarItems = (
    id,
    setItemIdInEditNameMode
  ) => [{

    // Add this item when there are workflow settings besides the workflow name
    //   enabled: true,
    //   icon: settings14Svg,
    //   id: 'WORKFLOW-SETTINGS',
    //   title: 'Workflow Settings',
    //   doAction: async () => {
    //     openWorkflowSettingsUseCase(id);
    //   }
    // }, {

    enabled: true,
    icon: delete14Svg,
    id: 'DELETE-WORKFLOW',
    title: 'Delete Workflow',
    doAction: async () => {
      deleteWorkflowUseCase(id);
    }
  }, {
    enabled: true,
    icon: more14Svg,
    id: 'MORE-ACTIONS',
    title: 'More Actions...',
    doAction: async () => {
      showMoreActionsForItem(id, setItemIdInEditNameMode);
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
    setItemIdInEditNameMode: (id: string | undefined) => void,
    copiedWorkflows: EntityList<CopiedEntitiesItem<Workflow, WorkflowEntityDeps>>
  ) => MenuItems = (id, setItemIdInEditNameMode, copiedWorkflows) => [{
    enabled: true,
    label: 'Rename Workflow',
    doAction: async () => {
      setItemIdInEditNameMode(id);
    }
    // Add this item when there are workflow settings besides the workflow name
    // }, {
    //   enabled: true,
    //   label: 'Workflow Settings',
    //   doAction: async () => {
    //     openWorkflowSettingsUseCase(id);
    //   }
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
    label: 'Copy Workflow',
    doAction: async () => {
      copyWorkflowUseCase(id)
    }
  }, {
    enabled: true,
    label: 'Paste Workflow...',
    submenu: buildPasteMenuItems(copiedWorkflows, id)
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
      copiedWorkflows,
    } = useAppState(state => {
      const { editMode: isEditMode } = state.ui;
      const { currentProjectId } = state.ui.projectSwitcher;
      const currentProject = state.entities.projects[currentProjectId];
      const dndTargetListItemId = state.ui.dragDrop.over?.workflowSwitcher?.workflowId;
      const dndFrom = state.ui.dragDrop.from;
      const resizingItem = state.ui.worktable.resizingItem;
      const copiedWorkflows = mapIdListToEntityList(state.ui.copy.workflows.entities, state.ui.copy.workflows.list);
      return {
        isEditMode,
        currentProjectId,
        currentProject,
        dndTargetListItemId,
        dndFrom,
        resizingItem,
        copiedWorkflows,
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
        ? createActionBarItemsEditMode(setItemIdInEditNameMode, copiedWorkflows)
        : actionBarItemsViewMode,
      [copiedWorkflows, isEditMode]
    );

    const itemActionBarItemsFactory: ItemActionBarItemsFactory = useCallback(
      (id) => isEditMode
        ? createItemActionBarItemsEditMode(id, setItemIdInEditNameMode)
        : createItemActionBarItemsViewMode(id),
      [isEditMode]
    )

    const dontShowActionBar = !!resizingItem || !!dndFrom;

    const onContextMenu: React.MouseEventHandler<HTMLDivElement> = useCallback((_) => {
      const contextMenuItems: MenuItems = isEditMode ? createContextMenuItemsEditMode(setItemIdInEditNameMode) : contextMenuItemsViewMode;
      showContextMenuUseCase(contextMenuItems);
    }, [isEditMode])


    const onItemContextMenu = useCallback((e: MouseEvent<HTMLElement>, itemId: EntityId) => {
      const contextMenuItems: MenuItems =
        isEditMode
          ? createItemContextMenuItemsEditMode(itemId, setItemIdInEditNameMode, copiedWorkflows)
          : createItemContextMenuItemsViewMode(itemId);
      showContextMenuUseCase(contextMenuItems);
    }, [copiedWorkflows, isEditMode])


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
