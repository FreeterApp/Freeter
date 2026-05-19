/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { execCommandSvg } from '@/widgets/commander/icons';
import styles from './widget.module.scss';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const { terminal } = widgetApi;
  const { cwd} = settings;
  const cmds = settings.cmds.filter(cmd=>cmd!=='');

  return cmds.length>0
    ? <Button
        onClick={_ => terminal.execCmdLines(cmds, cwd !== '' ? cwd : undefined )}
        iconSvg={execCommandSvg}
        title={`Execute Command-line${cmds.length>1 ? 's' : ''}`}
        size='Fill'
      />
    : <div className={styles['not-configured']}>
      Command-lines not specified.
    </div>
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
