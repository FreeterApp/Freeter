/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'webpage',
  icon: widgetSvg,
  name: 'Webpage',
  minSize: {
    w: 2,
    h: 2
  },
  description: 'The Webpage widget allows you to make most frequently used web applications and webpages easily accessible by embedding them into workflow tabs.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['clipboard', 'process', 'shell']
}

export default widgetType;
