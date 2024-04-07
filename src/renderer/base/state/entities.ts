/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { App } from '@/base/app';
import { createEntityCollection, EntityCollection, setManyInEntityCollection } from '@/base/entityCollection';
import { mapIdListToEntityList } from '@/base/entityList';
import { Project } from '@/base/project';
import { Widget, WidgetSettings } from '@/base/widget';
import { WidgetType } from '@/base/widgetType';
import { Workflow } from '@/base/workflow';

export interface EntitiesState {
  apps: EntityCollection<App>;
  projects: EntityCollection<Project>;
  widgets: EntityCollection<Widget>;
  widgetTypes: EntityCollection<WidgetType<WidgetSettings>>;
  workflows: EntityCollection<Workflow>;
}

export function createEntitiesState(): EntitiesState {
  return {
    apps: createEntityCollection(),
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
