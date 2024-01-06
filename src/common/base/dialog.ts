/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface MessageBoxConfig {
  message: string;
  type?: 'none' | 'info' | 'warning';
  buttons?: string[];
  defaultId?: number;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  cancelId?: number;
}

export interface MessageBoxResult {
  response: number;
  checkboxChecked: boolean;
}
