/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProjectSwitcherPos, ProjectSwitcherState } from '@/base/state/ui';
import { deepFreeze } from '@common/helpers/deepFreeze';

const projectSwitcherState: ProjectSwitcherState = {
  currentProjectId: 'SOME-ID',
  projectIds: [],
  pos: ProjectSwitcherPos.TabBarLeft
}

export const fixtureProjectSwitcher = (testData?: Partial<ProjectSwitcherState>): ProjectSwitcherState => deepFreeze({
  ...projectSwitcherState,
  ...testData
})
