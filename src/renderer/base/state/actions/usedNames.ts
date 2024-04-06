/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { App } from '@/base/app';
import { EntityCollection } from '@/base/entityCollection';
import { EntityIdList, mapIdListToEntityList } from '@/base/entityList';
import { Project } from '@/base/project';
import { Widget } from '@/base/widget';
import { WidgetLayout } from '@/base/widgetLayout';
import { WidgetList } from '@/base/widgetList';
import { Workflow } from '@/base/workflow';

const widgetNameSelector = (wgt: Widget) => wgt.coreSettings.name

export function getAllWidgetNamesFromWidgetLayout(
  widgetsState: EntityCollection<Widget>,
  layout: WidgetLayout
) {
  return mapIdListToEntityList(widgetsState, layout.map(item => item.widgetId)).map(widgetNameSelector)
}

export function getAllWidgetNamesFromWidgetList(
  widgetsState: EntityCollection<Widget>,
  list: WidgetList
) {
  return mapIdListToEntityList(widgetsState, list.map(item => item.widgetId)).map(widgetNameSelector)
}

export function getAllWorkflowNamesFromWorkflowIdList(
  workflowsState: EntityCollection<Workflow>,
  workflowIds: EntityIdList
) {
  return mapIdListToEntityList(workflowsState, workflowIds).map(item => item.settings.name)
}

export function getAllAppNamesFromAppIdList(
  appsState: EntityCollection<App>,
  appIds: EntityIdList
) {
  return mapIdListToEntityList(appsState, appIds).map(item => item.settings.name)
}

export function getAllProjectNamesFromProjectIdList(
  projectsState: EntityCollection<Project>,
  projectIds: EntityIdList
) {
  return mapIdListToEntityList(projectsState, projectIds).map(item => item.settings.name)
}
