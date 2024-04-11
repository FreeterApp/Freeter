/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetSettings, WidgetType } from '@/widgets/appModules'
import commander from './commander';
import fileOpener from './file-opener';
import linkOpener from './link-opener';
import note from './note';
import timer from './timer';
import toDoList from './to-do-list';
import webpage from './webpage';
import webQuery from './web-query';

const widgetTypes = [
  commander,
  fileOpener,
  linkOpener,
  note,
  timer,
  toDoList,
  webpage,
  webQuery,
] as unknown as WidgetType<WidgetSettings>[];

export default widgetTypes;
