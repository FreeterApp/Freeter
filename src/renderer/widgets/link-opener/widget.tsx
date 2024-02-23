/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { openLinkSvg } from '@/widgets/link-opener/icons';
import styles from './widget.module.scss';

function WidgetComp({settings, widgetApi}: WidgetReactComponentProps<Settings>) {
  const { shell } = widgetApi;

  const urls = settings.urls.filter(url=>url!=='');

  return urls.length>0
    ? <Button
        onClick={_ => urls.forEach(url => shell.openExternalUrl(url))}
        iconSvg={openLinkSvg}
        title={`Open Link${urls.length>1 ? 's' : ''}`}
        size='Fill'
      />
    : <div className={styles['not-configured']}>
      {'URLs not specified'}
    </div>
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
