/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WidgetApi } from '@/widgets/appModules';

export const labelCopyFullText = 'Copy Full Text';
export const labelUndo = 'Undo';
export const labelRedo = 'Redo';
export const labelCut = 'Cut';
export const labelCopy = 'Copy';
export const labelPaste = 'Paste';
export const labelSelectAll = 'Select All';

export function canCopyFullText() {
  return true;
}

export function copyFullText(elTextArea: HTMLTextAreaElement, widgetApi: WidgetApi) {
  widgetApi.clipboard.writeText(elTextArea.value);
}
