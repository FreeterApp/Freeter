/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { EntityIdList } from '@/base/entityList';
import { MemSaverConfigPrj } from '@/base/memSaver';
import { generateUniqueName } from '@/base/utils';

export interface ProjectSettings {
  readonly memSaver: MemSaverConfigPrj;
  readonly name: string;
}
export interface Project extends Entity {
  readonly settings: ProjectSettings;
  readonly workflowIds: EntityIdList;
  readonly currentWorkflowId: EntityId;
}

export function createProject(id: EntityId, projectName: string): Project {
  return {
    id,
    settings: {
      memSaver: {},
      name: projectName,
    },
    workflowIds: [],
    currentWorkflowId: ''
  };
}

export function generateProjectName(usedNames: string[]): string {
  return generateUniqueName('Project', usedNames);
}

export function updateProjectSettings(project: Project, settings: ProjectSettings): Project {
  return {
    ...project,
    settings
  }
}

export function updateProjectWorkflows(project: Project, workflowIds: EntityIdList): Project {
  return {
    ...project,
    workflowIds
  }
}
