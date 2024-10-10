/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MemSaverState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const memSaverState: MemSaverState = {
  activeWorkflows: [],
  workflowTimeouts: {}
}

export const fixtureMemSaver = (testData?: Partial<MemSaverState>): MemSaverState => deepFreeze({
  ...memSaverState,
  ...testData
})
