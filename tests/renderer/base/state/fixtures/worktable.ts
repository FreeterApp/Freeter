/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorktableResizingItemState, WorktableState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const worktableNotResizing: WorktableState = {}
const worktableResizingItem: WorktableResizingItemState = {
  delta: {},
  edges: {},
  itemId: 'SOME-ITEM',
  workflowId: 'SOME-WORKFLOW',
  minSize: {
    w: 1,
    h: 1
  }
}

export const fixtureWorktableResizingItem = (testData?: Partial<WorktableResizingItemState>): WorktableState => deepFreeze({
  resizingItem: {
    ...worktableResizingItem,
    ...testData
  }
})

export const fixtureWorktableNotResizing = (testData?: Partial<WorktableState>): WorktableState => deepFreeze({
  ...worktableNotResizing,
  ...testData
})
