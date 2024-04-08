/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';

const processProvider: ProcessProvider = {
  getProcessInfo: jest.fn()
}

export const mockProcessProvider = (props: Partial<ProcessProvider>) => ({ ...processProvider, ...props });
