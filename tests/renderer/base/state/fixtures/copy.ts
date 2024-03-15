/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { CopyState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const copyState: CopyState = {
  widgets: {
    entities: {},
    list: []
  },
  workflows: {
    entities: {},
    list: []
  }
}

export const fixtureCopyState = (testData?: Partial<CopyState>): CopyState => deepFreeze({
  ...copyState,
  ...testData
})
