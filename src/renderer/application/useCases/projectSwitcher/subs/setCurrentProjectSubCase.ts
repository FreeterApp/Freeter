/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { ProjectSwitcherState } from '@/base/state/ui';

export function setCurrentProjectSubCase(
  projectSwitcherState: ProjectSwitcherState,
  currentProjectIdToSet: EntityId,
): [
    updatedProjectSwitcher: ProjectSwitcherState,
  ] {
  let updatedProjectSwitcher: ProjectSwitcherState;
  if (projectSwitcherState.currentProjectId !== currentProjectIdToSet) {
    updatedProjectSwitcher = {
      ...projectSwitcherState,
      currentProjectId: currentProjectIdToSet
    }

    // When calling MemSaver there are edge cases when current/new id is '' (empty string)
  } else {
    updatedProjectSwitcher = projectSwitcherState;
  }

  return [
    updatedProjectSwitcher,
  ]
}
