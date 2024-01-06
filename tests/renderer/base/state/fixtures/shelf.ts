/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ShelfState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const shelfState: ShelfState = {
  widgetList: []
}

export const fixtureShelf = (testData?: Partial<ShelfState>): ShelfState => deepFreeze({
  ...shelfState,
  ...testData
})
