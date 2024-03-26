/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createEntityCollection, EntityCollection, setManyInEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { Project } from '@/base/project';
import { Widget } from '@/base/widget';
import { WidgetSettings, WidgetType } from '@/base/widgetType';
import { Workflow } from '@/base/workflow';

export interface EntitiesState {
  projects: EntityCollection<Project>;
  widgets: EntityCollection<Widget>;
  widgetTypes: EntityCollection<WidgetType<WidgetSettings>>;
  workflows: EntityCollection<Workflow>;
}

export function createEntitiesState(): EntitiesState {
  return {
    projects: createEntityCollection(),
    widgets: createEntityCollection(),
    widgetTypes: createEntityCollection(),
    workflows: createEntityCollection()
  }
}

export type WidgetEntityDeps = Pick<EntitiesState, never>;

export type WorkflowEntityDeps = Pick<EntitiesState, 'widgets'>;

export function getWorkflowEntityDeps(workflow: Workflow, entities: EntitiesState): WorkflowEntityDeps {
  return {
    widgets: setManyInEntityCollection({}, mapIdListToEntityList(entities.widgets, workflow.layout.map(item => item.widgetId)))
  }
}
