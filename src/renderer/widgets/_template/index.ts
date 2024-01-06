/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/types';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'widget-id',
  icon: widgetSvg,
  name: 'Widget Name',
  minSize: {
    w: 1,
    h: 1
  },
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: []
}

export default widgetType;
