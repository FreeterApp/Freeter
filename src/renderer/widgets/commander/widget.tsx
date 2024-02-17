/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Button, ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { Settings } from './settings';
import { execCommandSvg } from '@/widgets/commander/icons';

function WidgetComp({settings}: WidgetReactComponentProps<Settings>) {
  const {cmds} = settings;
  return cmds.length>0
    ? <Button
        onClick={_ => {
        }}
        iconSvg={execCommandSvg}
        title={`Execute Command-line${cmds.length>1 ? 's' : ''}`}
        size='Fill'
      />
    : 'Command-lines not specified.';
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
}
