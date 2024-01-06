/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';
import { ProductInfoProvider } from '@/application/interfaces/productInfoProvider';

type Deps = {
  productInfoProvider: ProductInfoProvider;
  processProvider: ProcessProvider;
}

export function createGetAboutInfoUseCase({
  productInfoProvider,
  processProvider,
}: Deps) {
  function getAboutInfoUseCase() {
    return {
      productInfo: productInfoProvider.getProductInfo(),
      browser: processProvider.getProcessInfo().browser
    }
  }
  return getAboutInfoUseCase;
}

export type GetAboutInfoUseCase = ReturnType<typeof createGetAboutInfoUseCase>;
