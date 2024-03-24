/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'commander',
  icon: widgetSvg,
  name: 'Commander',
  minSize: {
    w: 1,
    h: 1
  },
  description: 'The Commander widget allows to set command-lines and run them in Terminal with a single click.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['terminal']
}

export default widgetType;
