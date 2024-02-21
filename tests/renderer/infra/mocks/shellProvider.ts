/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShellProvider } from '@/application/interfaces/shellProvider';

const shellProvider: ShellProvider = {
  openExternal: jest.fn(),
  openPath: jest.fn()
}

export const mockShellProvider = (props: Partial<ShellProvider>) => ({ ...shellProvider, ...props });
