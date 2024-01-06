/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface ClipboardProvider {
  writeBookmark: (title: string, url: string) => Promise<void>;
  writeText: (text: string) => Promise<void>;
}
