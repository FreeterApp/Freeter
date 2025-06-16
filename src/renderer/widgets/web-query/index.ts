/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetType } from '@/widgets/appModules';
import { settingsEditorComp, Settings, createSettingsState } from './settings';
import { widgetComp } from './widget';
import { widgetSvg } from './icons';

const widgetType: WidgetType<Settings> = {
  id: 'web-query',
  icon: widgetSvg,
  name: 'Web Query',
  minSize: {
    w: 2,
    h: 1
  },
  description: 'The Web Query widget allows you to perform templated queries on a web search engine (or another website) by only typing a variable part of the reusable query.',
  createSettingsState,
  settingsEditorComp,
  widgetComp,
  requiresApi: ['shell', 'widgets']
}

export default widgetType;
