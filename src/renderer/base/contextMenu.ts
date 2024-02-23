import { MenuItems } from '@common/base/menu';

export const contextMenuForTextInput: MenuItems = [
  { role: 'undo', label: 'Undo' },
  { role: 'redo', label: 'Redo' },
  { type: 'separator' },
  { role: 'cut', label: 'Cut' },
  { role: 'copy', label: 'Copy' },
  { role: 'paste', label: 'Paste' },
  { type: 'separator' },
  { role: 'selectAll', label: 'Select All' },
]
