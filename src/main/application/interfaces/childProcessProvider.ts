/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface ChildProcessProvider {
  spawnDetached: (cmd: string, args: string[], opts?: {
    cwd?: string;
    env?: Record<string, string>;
    shell?: boolean;
  }) => void;
}
