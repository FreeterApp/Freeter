/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export type ProductInfoBacker = [name: string];
export interface ProductInfoBackers {
  bronzeSponsors: Array<ProductInfoBacker>;
  backersPlus: Array<ProductInfoBacker>;
  backers: Array<ProductInfoBacker>;
}
export interface ProductInfo {
  version: string;
  builtAt: string;
  commitHash: string;
  backers: ProductInfoBackers;
}
