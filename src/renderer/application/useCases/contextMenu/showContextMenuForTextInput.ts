/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ContextMenuProvider } from '@/application/interfaces/contextMenuProvider';
import { contextMenuForTextInput } from '@/base/contextMenu';

type Deps = {
  contextMenu: ContextMenuProvider;
}

export function createShowContextMenuForTextInputUseCase({
  contextMenu
}: Deps) {
  const showContextMenuForTextInput = () => contextMenu.show(contextMenuForTextInput);

  return showContextMenuForTextInput;
}

export type ShowContextMenuForTextInputUseCase = ReturnType<typeof createShowContextMenuForTextInputUseCase>;
