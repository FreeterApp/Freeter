/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'to-do-list',
  icon: widgetSvg,
  name: 'To-Do List',
  minSize: {
    w: 2,
    h: 2
  },
  description: 'The To-Do List widget allows yout to quickly organize tasks with simple to-do lists.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['dataStorage']
}

export default widgetType;
