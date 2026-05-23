/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'timer',
  icon: widgetSvg,
  name: 'Timer',
  minSize: {
    w: 1,
    h: 1
  },
  description: 'The Timer widget allows you to setup a simple countdown timer that starts with a click and notifies you when time is up.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
}

export default widgetType;
