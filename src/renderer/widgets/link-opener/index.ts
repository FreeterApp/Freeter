/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'link-opener',
  icon: widgetSvg,
  name: 'Link Opener',
  minSize: {
    w: 1,
    h: 1
  },
  description: 'The Link Opener widget allows you to set a link or a group of links and open them in Browser with a single click.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['shell']
}

export default widgetType;
