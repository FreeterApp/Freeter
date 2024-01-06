/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProductInfo, ProductInfoBacker, ProductInfoBackers } from '@/base/productInfo';
import { makeFixture } from '@utils/makeFixture';

const productInfoBackerA: ProductInfoBacker = ['Name A'];
const productInfoBackerB: ProductInfoBacker = ['Name B'];
const productInfoBackerC: ProductInfoBacker = ['Name C'];
const productInfoBackerD: ProductInfoBacker = ['Name D'];

const productInfoBackers: ProductInfoBackers = {
  backers: [],
  backersPlus: [],
  bronzeSponsors: []
}
const productInfo: ProductInfo = {
  builtAt: '2024-01-01T23:55:00Z',
  commitHash: '59e22385901a19c2ca697f96347cf1061bf9a4bd',
  version: '2.0.0',
  backers: {
    ...productInfoBackers
  }
}

export const fixtureProductInfo = makeFixture(productInfo);
export const fixtureProductInfoBackers = makeFixture(productInfoBackers);
export const fixtureProductInfoBackerA = makeFixture(productInfoBackerA);
export const fixtureProductInfoBackerB = makeFixture(productInfoBackerB);
export const fixtureProductInfoBackerC = makeFixture(productInfoBackerC);
export const fixtureProductInfoBackerD = makeFixture(productInfoBackerD);
