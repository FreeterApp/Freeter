/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ActionBarItems } from '@/base/actionBar';
import { canCopyFullText, copyFullText, labelCopyFullText } from './actions';
import { WidgetApi } from '@/widgets/appModules';
import { copyFullTextSvg } from './icons';

export function createActionBarItems(elTextArea: HTMLTextAreaElement | null, widgetApi: WidgetApi): ActionBarItems {
  return (!elTextArea) ? [] : [
    {
      enabled: canCopyFullText(),
      icon: copyFullTextSvg,
      id: 'COPY-FULL-TEXT',
      title: labelCopyFullText,
      doAction: async () => copyFullText(elTextArea, widgetApi)
    }
  ];
}
