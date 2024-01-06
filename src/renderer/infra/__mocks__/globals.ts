/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { RendererGlobals } from '@/infra/interfaces/globals'

const globals: RendererGlobals = {
  electronIpcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
    send: jest.fn()
  }
}

export const { electronIpcRenderer } = globals;
