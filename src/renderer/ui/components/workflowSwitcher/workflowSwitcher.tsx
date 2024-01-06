/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorkflowSwitcherViewModelHook } from '@/ui/components/workflowSwitcher/workflowSwitcherViewModel';
import clsx from 'clsx';
import styles from './workflowSwitcher.module.scss';
import React from 'react';
import { WorkflowSwitcherItemProps } from '@/ui/components/workflowSwitcher/workflowSwitcherItemViewModel';
import { ActionBarProps } from '@/ui/components/basic/actionBar';

type Deps = {
  ActionBar: React.FC<ActionBarProps>;
  WorkflowSwitcherItem: React.FC<WorkflowSwitcherItemProps>;
  useWorkflowSwitcherViewModel: WorkflowSwitcherViewModelHook;
}

export function createWorkflowSwitcherComponent({
  ActionBar,
  WorkflowSwitcherItem,
  useWorkflowSwitcherViewModel
}: Deps) {
  function WorkflowSwitcher() {
    const {
      isEditMode,
      workflows,
      currentWorkflowId,
      dndTargetListItemId,
      itemIdInEditNameMode,
      onFinishEditName,
      onItemRename,
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
      actionBarItems,
      itemActionBarActions,
      dontShowActionBar,
    } = useWorkflowSwitcherViewModel();

    return workflows ? (
      <div className={styles['workflow-switcher-bar']}>
        <div
          role="tablist"
          className={clsx(
            styles['workflow-switcher'],
            isEditMode && dndTargetListItemId === null && styles['is-drop-area'],
            dontShowActionBar && styles['dont-show-action-bar']
          )}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {workflows.map(item => (
            <WorkflowSwitcherItem
              key={item.id}
              id={item.id}
              name={item.settings.name}
              isEditMode={isEditMode}
              isCurrent={item.id===currentWorkflowId}
              isDropArea={isEditMode && item.id===dndTargetListItemId}
              isEditNameMode={item.id===itemIdInEditNameMode}
              onEditName={onItemRename}
              onFinishEditName={onFinishEditName}
              onClick={onItemClick}
              onDragStart={onItemDragStart}
              onDragEnd={onItemDragEnd}
              onDragEnter={onItemDragEnter}
              onDragLeave={onItemDragLeave}
              onDragOver={onItemDragOver}
              onDrop={onItemDrop}
              actionBarActions={itemActionBarActions}
            />
          ))}
          <ActionBar
            actionBarItems={actionBarItems}
            className={styles['workflow-switcher-action-bar']}
          ></ActionBar>
        </div>
      </div>
    ) : <div/>
  }

  return WorkflowSwitcher;
}
