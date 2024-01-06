/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';
import { ProductInfoProvider } from '@/application/interfaces/productInfoProvider';
import { createGetAboutInfoUseCase } from '@/application/useCases/about/getAboutInfo';
import { ProductInfo } from '@/base/productInfo';
import { ProcessInfo } from '@common/base/process';
import { fixtureProductInfo } from '@tests/base/fixtures/productInfo';
import { fixtureProcessInfoBrowser, fixtureProcessInfoLinux } from '@testscommon/base/fixtures/process'

async function setup(opts?: {
  processInfo?: ProcessInfo;
  productInfo?: ProductInfo;
}) {
  const processProviderMock: ProcessProvider = {
    getProcessInfo: () => opts?.processInfo || fixtureProcessInfoLinux()
  }
  const productInfoProviderMock: ProductInfoProvider = {
    getProductInfo: () => opts?.productInfo || fixtureProductInfo()
  }
  const getAboutInfoUseCase = createGetAboutInfoUseCase({
    processProvider: processProviderMock,
    productInfoProvider: productInfoProviderMock,
  });
  return {
    processProviderMock,
    productInfoProviderMock,
    getAboutInfoUseCase,
  }
}

describe('getAboutInfoUseCase()', () => {
  it('should return a correct info provided by ProcessProvider and ProductInfoProvider', async () => {
    const browserVer = '22.33.44';
    const builtAt = '2024-01-02T03:04:05Z';
    const commitHash = 'commit hash';
    const version = '1.2.3';
    const {
      getAboutInfoUseCase
    } = await setup({
      processInfo: fixtureProcessInfoLinux({ browser: fixtureProcessInfoBrowser({ ver: browserVer }) }),
      productInfo: fixtureProductInfo({ builtAt, commitHash, version })
    })

    const res = getAboutInfoUseCase();

    expect(res.browser.ver).toBe(browserVer);
    expect(res.productInfo.builtAt).toBe(builtAt);
    expect(res.productInfo.commitHash).toBe(commitHash);
    expect(res.productInfo.version).toBe(version);
  });
})
