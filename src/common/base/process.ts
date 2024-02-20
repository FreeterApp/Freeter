/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface ProcessInfoBrowser {
  name: 'Chrome';
  ver: string;
}

export type ProcessInfoOsName = 'darwin' | 'linux' | 'win32';

export interface ProcessInfoOs {
  name: ProcessInfoOsName;
  ver: string;
}

export interface ProcessInfo {
  browser: ProcessInfoBrowser;
  os: ProcessInfoOs;
  isWin: boolean;
  isMac: boolean;
  isLinux: boolean;
  isDevMode: boolean;
}
