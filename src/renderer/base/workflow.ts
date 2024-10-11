/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Entity, EntityId } from '@/base/entity';
import { MemSaverConfigWfl } from '@/base/memSaver';
import { generateUniqueName } from '@/base/utils';
import { WidgetLayout } from '@/base/widgetLayout';

export interface WorkflowSettings {
  readonly memSaver: MemSaverConfigWfl;
  readonly name: string;
}

export interface Workflow extends Entity {
  readonly layout: WidgetLayout;
  readonly settings: WorkflowSettings;
}

export function createWorkflow(id: EntityId, name: string): Workflow {
  return {
    id,
    layout: [],
    settings: {
      memSaver: {},
      name
    }
  };
}

export function generateWorkflowName(usedNames: string[]): string {
  return generateUniqueName('Workflow', usedNames);
}


export function updateWorkflowSettings(workflow: Workflow, settings: WorkflowSettings): Workflow {
  return {
    ...workflow,
    settings
  }
}

export function updateWorkflowLayout(workflow: Workflow, layout: WidgetLayout): Workflow {
  return {
    ...workflow,
    layout
  }
}
