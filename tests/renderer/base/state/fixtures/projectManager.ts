/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProjectManagerState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const projectManagerState: ProjectManagerState = {
  currentProjectId: '',
  deleteProjectIds: null,
  projects: null,
  projectIds: null,
  duplicateProjectIds: null
}

export const fixtureProjectManager = (testData?: Partial<ProjectManagerState>): ProjectManagerState => deepFreeze({
  ...projectManagerState,
  ...testData
})
