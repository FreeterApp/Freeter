/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { WorkflowSettingsState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const workflowSettingsState: WorkflowSettingsState = {
  workflow: null
}

export const fixtureWorkflowSettings = (testData?: Partial<WorkflowSettingsState>): WorkflowSettingsState => deepFreeze({
  ...workflowSettingsState,
  ...testData
})
