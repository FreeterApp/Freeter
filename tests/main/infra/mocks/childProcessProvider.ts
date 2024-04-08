/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ChildProcessProvider } from '@/application/interfaces/childProcessProvider';

const childProcessProvider: ChildProcessProvider = {
  spawnDetached: jest.fn()
}

export const mockChildProcessProvider = (props: Partial<ChildProcessProvider>) => ({ ...childProcessProvider, ...props });
