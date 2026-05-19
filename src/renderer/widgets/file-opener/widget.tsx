/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { openFileSvg, openFolderSvg } from '@/widgets/file-opener/icons';
import styles from './widget.module.scss';
import { SettingsType, settingsTypeNamesCapital } from '@/widgets/file-opener/settingsType';
import { useCallback } from 'react';

function WidgetComp({settings, widgetApi, sharedState}: WidgetReactComponentProps<Settings>) {
  const { shell } = widgetApi;
  const { files, folders, type, openIn } = settings;
  const {apps} = sharedState.apps;
  const openInApp = openIn !== '' ? apps[openIn] : undefined;

  const paths = (type === SettingsType.Folder ? folders : files).filter(path=>path!=='');
  const iconSvg = type === SettingsType.Folder ? openFolderSvg : openFileSvg;

  const onBtnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(_ => {
    if (openInApp) {
      const { execPath, cmdArgs} = openInApp.settings;
      shell.openApp( execPath, [...cmdArgs ? [cmdArgs] : [], ...paths])
    } else {
      paths.forEach(path => shell.openPath(path))
    }
  }, [openInApp, paths, shell])

  return paths.length>0
    ? <Button
        onClick={onBtnClick}
        iconSvg={iconSvg}
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
