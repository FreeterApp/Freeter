/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { EntityId } from '@/base/entity';
import { Project } from '@/base/project';

export function setCurrentWorkflowSubCase(
  currentProject: Project,
  currentWorkflowIdToSet: EntityId,
): [
    updatedProject: Project,
  ] {
  let updatedProject: Project
  if (currentProject.currentWorkflowId !== currentWorkflowIdToSet) {
    updatedProject = {
      ...currentProject,
      currentWorkflowId: currentWorkflowIdToSet
    }

    // When calling MemSaver there are edge cases when current/new id is '' (empty string)
  } else {
    updatedProject = currentProject;
  }

  return [
    updatedProject,
  ]
}
