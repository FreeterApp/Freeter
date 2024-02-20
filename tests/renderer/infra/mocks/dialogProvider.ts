/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { DialogProvider } from '@/application/interfaces/dialogProvider';

export const dialogProvider: DialogProvider = {
  showMessageBox: jest.fn(),
  showOpenDirDialog: jest.fn(),
  showOpenFileDialog: jest.fn(),
  showSaveFileDialog: jest.fn()
}

export const mockDialogProvider = (props: Partial<DialogProvider>) => ({ ...dialogProvider, ...props });
