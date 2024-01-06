/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProductInfoBackers } from '@/base/productInfo';
import { RendererGlobals } from './interfaces/globals';

declare global {
  interface Window {
    freeter: RendererGlobals;
  }
  const VERSION: string;
  const BUILT_AT: string;
  const COMMIT_HASH: string;
  const BACKERS: ProductInfoBackers;
}

export const { electronIpcRenderer } = window.freeter;
