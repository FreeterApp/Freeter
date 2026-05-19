/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBar } from '@/ui/components/basic/actionBar';
import { WidgetProps, WidgetViewModelHook } from '@/ui/components/widget/widgetViewModel';
import styles from './widget.module.scss';
import clsx from 'clsx';
import { memo } from 'react';

type Deps = {
  useWidgetViewModel: WidgetViewModelHook;
}

export function createWidgetComponent({
  useWidgetViewModel
}: Deps) {
  function Component(props: WidgetProps) {

    const {
      editMode,
      env,
      widget,
      actionBarItems,
      widgetName,
      widgetApi,
      WidgetComp,
      sharedState,
      dontShowActionBar,
      onContextMenuHandler,
    } = useWidgetViewModel(props);

    if (!widget) {
      return <div>Widget instance does not exist</div>
    }

    if (!WidgetComp) {
      return <div>Unknown widget type</div>
    }

    if (env.isPreview) {
      return (
        <WidgetComp id={widget.id} env={env} settings={widget.settings} widgetApi={widgetApi} sharedState={sharedState}></WidgetComp>
      )
    }

    return <div
      className={clsx(styles.widget, dontShowActionBar && styles['dont-show-action-bar'])}
      onContextMenu={onContextMenuHandler}
    >
      <div className={styles['widget-header']}>
        <div className={styles['widget-header-name']}>{widgetName}</div>
        <ActionBar
          actionBarItems={actionBarItems}
          className={styles['widget-header-action-bar']}
        ></ActionBar>
      </div>
      <div className={styles['widget-body']} data-widget-context="" {...{ inert: editMode ? true : undefined }}>
        <WidgetComp id={widget.id} env={env} settings={widget.settings} widgetApi={widgetApi} sharedState={sharedState}></WidgetComp>
      </div>
    </div>
  }

  return memo(Component);
}

export type WidgetComponent = ReturnType<typeof createWidgetComponent>;
