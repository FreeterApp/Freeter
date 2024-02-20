/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBar } from '@/ui/components/basic/actionBar';
import { WidgetProps, WidgetViewModelHook } from '@/ui/components/widget/widgetViewModel';
import styles from './widget.module.scss';
import clsx from 'clsx';

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
        <WidgetComp id={widget.id} env={env} settings={widget.settings} widgetApi={widgetApi}></WidgetComp>
      )
    }

    return <div
      className={clsx(styles.widget, dontShowActionBar && styles['dont-show-action-bar'])}
    >
      <div className={styles['widget-header']}>
        <div className={styles['widget-header-name']}>{widgetName}</div>
        <ActionBar
          actionBarItems={actionBarItems}
          className={styles['widget-header-action-bar']}
        ></ActionBar>
      </div>
      <div className={styles['widget-body']} onContextMenu={onContextMenuHandler} data-widget-context="" {...{ inert: editMode ? '' : undefined }}>
        <WidgetComp id={widget.id} env={env} settings={widget.settings} widgetApi={widgetApi}></WidgetComp>
      </div>
    </div>
  }

  return Component;
}

export type WidgetComponent = ReturnType<typeof createWidgetComponent>;
