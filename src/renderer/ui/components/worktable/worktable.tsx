/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import React, { memo } from 'react';
import styles from './worktable.module.scss';
import { WorktableViewModel } from '@/ui/components/worktable/worktableViewModel';
import { WidgetLayoutProps } from '@/ui/components/worktable/widgetLayout';
import { InAppNote } from '@/ui/components/basic/inAppNote';
import { SvgIcon } from '@/ui/components/basic/svgIcon';
import { editMode24Svg } from '@/ui/assets/images/appIcons';
import { add14Svg } from '@/ui/assets/images/appIcons';

type Deps = {
  WidgetLayout: React.FC<WidgetLayoutProps>;
  useWorktableViewModel: WorktableViewModel;
}

export function createWorktableComponent({
  WidgetLayout,
  useWorktableViewModel
}: Deps) {
  function WorktableComponent() {
    const {
      currentWorkflowId,
      dndDraggingFrom,
      dndDraggingWidgetType,
      dndOverWorktableLayout,
      isEditMode,
      resizingItem,
      activeWorkflows,
      noWorkflows,
      widgetTypes,
      copiedWidgets,
    } = useWorktableViewModel();

    return noWorkflows
      ? (
        !isEditMode
        ? <InAppNote className={styles['no-workflows']}>
            {'The project does not have any workflows. Enable Edit Mode with '}
            <SvgIcon svg={editMode24Svg} className={styles['edit-mode-icon']} />
            {' button above (or under the Edit menu) to edit it.'}
          </InAppNote>
        : <InAppNote className={styles['no-workflows']}>
            {'Click '}
            <SvgIcon svg={add14Svg} className={styles['add-icon']} />
            {' button at the Tab Bar above to add a workflow to the project.'}
          </InAppNote>
        )
      : <div
        className={styles.worktable}
      >
        {activeWorkflows.map(({wfl, prjId}) => {
          const isCurrentWorkflow = wfl.id === currentWorkflowId;
          return <WidgetLayout
            key={wfl.id}
            projectId={prjId}
            workflowId={wfl.id}
            isVisible={isCurrentWorkflow}
            layoutItems={wfl.layout}
            isEditMode={isCurrentWorkflow ? isEditMode : false}
            resizingItem={isCurrentWorkflow ? resizingItem : undefined}
            dndDraggingFrom={isCurrentWorkflow ? dndDraggingFrom : undefined}
            dndDraggingWidgetType={isCurrentWorkflow ? dndDraggingWidgetType : undefined}
            dndOverWorktableLayout={isCurrentWorkflow ? dndOverWorktableLayout : undefined}
            widgetTypes={widgetTypes}
            copiedWidgets={copiedWidgets}
          />
        })}
      </div>
  }
  return memo(WorktableComponent);
}
