/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { copyFullText, labelCopy, labelCopyFullText, labelCut, labelPaste, labelRedo, labelSelectAll, labelUndo } from './actions';
import { WidgetApi, WidgetContextMenuFactory, WidgetMenuItem } from '@/widgets/appModules';

export const textAreaContextId = 'textarea';
export function createContextMenuFactory(elTextArea: HTMLTextAreaElement | null, widgetApi: WidgetApi): WidgetContextMenuFactory {
  return (contextId) => {
    const items: WidgetMenuItem[] = []
    if (elTextArea) {
      const itemsGroup: WidgetMenuItem[] = [
        {
          doAction: async () => copyFullText(elTextArea, widgetApi),
          label: labelCopyFullText
        }
      ]
      items.push(...itemsGroup);

      if (contextId === textAreaContextId) {
        const itemsGroup: WidgetMenuItem[] = [
          { type: 'separator' },
          {
            label: labelUndo,
            role: 'undo'
          }, {
            label: labelRedo,
            role: 'redo'
          },
          { type: 'separator' },
          {
            label: labelCut,
            role: 'cut',
          },
          {
            label: labelCopy,
            role: 'copy',
          },
          {
            label: labelPaste,
            role: 'paste',
          },
          {
            label: labelSelectAll,
            role: 'selectAll',
          }
        ]

        items.push(...itemsGroup);
      }
    }

    return items;
  }
}
