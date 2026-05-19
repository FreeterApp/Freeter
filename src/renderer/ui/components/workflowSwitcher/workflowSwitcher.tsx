/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorkflowSwitcherViewModelHook } from '@/ui/components/workflowSwitcher/workflowSwitcherViewModel';
import clsx from 'clsx';
import styles from './workflowSwitcher.module.scss';
import { ActionBar } from '@/ui/components/basic/actionBar';
import { WorkflowSwitcherItem } from '@/ui/components/workflowSwitcher/workflowSwitcherItem';
import { memo } from 'react';
import { ProjectSwitcherProps } from '@/ui/components/projectSwitcher';
import { PaletteProps, PalettePropsPos } from '@/ui/components/palette';

type Deps = {
  EditModeToggle: React.FC;
  ProjectSwitcher: React.FC<ProjectSwitcherProps>;
  ManageProjectsButton: React.FC;
  Palette: React.FC<PaletteProps>;
  useWorkflowSwitcherViewModel: WorkflowSwitcherViewModelHook;
}

export function createWorkflowSwitcherComponent({
  EditModeToggle,
  ProjectSwitcher,
  ManageProjectsButton,
  Palette,
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
      onContextMenu,
      onItemContextMenu,
      actionBarItems,
      itemActionBarItemsFactory,
      dontShowActionBar,
      showPrjSwitcherLeft,
      showPaletteLeft,
      showPaletteRight,
      showEditToggleLeft,
      showPrjSwitcherRight,
      showEditToggleRight,
    } = useWorkflowSwitcherViewModel();

    const compPrjSwitcher =
      <div
        className={clsx(styles['workflow-switcher-bar-section'], styles['workflow-switcher-bar-project-switcher-section'])}>
          <ProjectSwitcher className={styles['project-switcher']} />
          <ManageProjectsButton />
      </div>

    const compEditToggle =
      <div className={styles['workflow-switcher-bar-section']}>
        <EditModeToggle />
      </div>

    const compPalette =
      <div className={clsx(styles['workflow-switcher-bar-section'], styles['workflow-switcher-bar-palette-section'])}>
        <Palette pos={PalettePropsPos.TabBar}/>
      </div>

    return (
      <div className={styles['workflow-switcher-bar']}>
        {showPrjSwitcherLeft && compPrjSwitcher}
        {showEditToggleLeft && compEditToggle}
        {showPaletteLeft && compPalette}
        {workflows ? <div
          role="tablist"
          className={clsx(
            styles['workflow-switcher-bar-section'],
            styles['workflow-switcher'],
            isEditMode && dndTargetListItemId === null && styles['is-drop-area'],
            dontShowActionBar && styles['dont-show-action-bar']
          )}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onContextMenu={onContextMenu}
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
              onContextMenu={onItemContextMenu}
              actionBarItemsFactory={itemActionBarItemsFactory}
            />
          ))}
          <ActionBar
            actionBarItems={actionBarItems}
            className={styles['workflow-switcher-action-bar']}
          ></ActionBar>
        </div>
        : <div
            className={clsx(
              styles['workflow-switcher-bar-section'],
              styles['workflow-switcher'],
            )}
          ></div>
        }

        {showPrjSwitcherRight && compPrjSwitcher}
        {showPaletteRight && compPalette}
        {showEditToggleRight && compEditToggle}
      </div>
    )
  }

  return memo(WorkflowSwitcher);
}
