/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'note',
  icon: widgetSvg,
  name: 'Note',
  minSize: {
    w: 2,
    h: 2
  },
  description: 'The Note widget allows you to write quick notes, such as thoughts, ideas or another important information you  need to keep in front of you.',
  maximizable: true,
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['clipboard', 'dataStorage']
}

export default widgetType;
