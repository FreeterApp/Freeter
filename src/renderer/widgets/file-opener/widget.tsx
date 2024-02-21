/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { execCommandSvg } from '@/widgets/file-opener/icons';
import styles from './widget.module.scss';
import { SettingsType, settingsTypeNamesCapital } from '@/widgets/file-opener/settingsType';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const { shell } = widgetApi;
  const { files, folders, type } = settings;

  const paths = (type === SettingsType.Folder ? folders : files).filter(path=>path!=='');

  return paths.length>0
    ? <Button
        onClick={_ => paths.forEach(path => shell.openPath(path))}
        iconSvg={execCommandSvg}
        title={`Open ${settingsTypeNamesCapital[settings.type]}${paths.length>1 ? 's' : ''}`}
        size='Fill'
      />
    : <div className={styles['not-configured']}>
      {`${settingsTypeNamesCapital[settings.type]}s not specified`}
    </div>
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
