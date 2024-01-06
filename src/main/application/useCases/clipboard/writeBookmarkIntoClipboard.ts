/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ClipboardProvider } from '@/application/interfaces/clipboardProvider';

interface Deps {
  clipboardProvider: ClipboardProvider;
}

export function createWriteBookmarkIntoClipboardUseCase({ clipboardProvider }: Deps) {
  return async function writeBookmarkIntoClipboardUseCase(title: string, url: string) {
    clipboardProvider.writeBookmark(title, url);
  }
}

export type WriteBookmarkIntoClipboardUseCase = ReturnType<typeof createWriteBookmarkIntoClipboardUseCase>;
