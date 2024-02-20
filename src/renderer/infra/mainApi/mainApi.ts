/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { RendererGlobals } from '@/infra/interfaces/globals';

declare global {
  interface Window {
    freeter: RendererGlobals;
  }
}

const mainApi = window.freeter.getMainApiOnce();
if (!mainApi) {
  throw new Error('MainAPI unavailable');
}

export const { electronIpcRenderer } = mainApi;
