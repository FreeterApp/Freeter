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

export interface FileDialogFilter {
  name: string;
  extensions: string[];
}

export interface OpenFileDialogConfig {
  multiSelect?: boolean;
  defaultPath?: string;
  filters?: FileDialogFilter[];
  title?: string;
}

export interface SaveFileDialogConfig {
  defaultPath?: string;
  filters?: FileDialogFilter[];
  title?: string;
}

export interface OpenDirDialogConfig {
  multiSelect?: boolean;
  defaultPath?: string;
  title?: string;
}

export interface OpenDialogResult {
  canceled: boolean;
  filePaths: string[];
}

export interface SaveDialogResult {
  canceled: boolean;
  filePath?: string;
}
