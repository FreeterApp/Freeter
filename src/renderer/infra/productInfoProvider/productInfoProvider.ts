/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { deepFreeze } from '@common/helpers/deepFreeze';
import { ProductInfoProvider } from '@/application/interfaces/productInfoProvider';
import { ProductInfo } from '@/base/productInfo';

export function createProductInfoProvider(): ProductInfoProvider {
  const productInfo = deepFreeze<ProductInfo>({
    builtAt: BUILT_AT,
    commitHash: COMMIT_HASH,
    version: VERSION,
    backers: BACKERS
  })
  return {
    getProductInfo: () => productInfo
  }
}
