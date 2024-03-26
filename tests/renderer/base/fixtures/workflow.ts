/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Workflow, WorkflowSettings } from '@/base/workflow';
import { makeFixture } from '@utils/makeFixture';

export const workflowSettings: WorkflowSettings[] = [{
  name: 'Workflow A',
}, {
  name: 'Workflow B',
}, {
  name: 'Workflow C',
}, {
  name: 'Workflow D',
}, {
  name: 'Workflow E',
}]

export const workflows: Workflow[] = [{
  settings: workflowSettings[0],
  id: 'W-A',
  layout: []
}, {
  settings: workflowSettings[1],
  id: 'W-B',
  layout: []
}, {
  settings: workflowSettings[2],
  id: 'W-C',
  layout: []
}, {
  settings: workflowSettings[3],
  id: 'W-D',
  layout: []
}, {
  settings: workflowSettings[4],
  id: 'W-E',
  layout: []
}];

export const fixtureWorkflowSettingsA = makeFixture(workflowSettings[0]);
export const fixtureWorkflowSettingsB = makeFixture(workflowSettings[1]);
export const fixtureWorkflowSettingsC = makeFixture(workflowSettings[2]);
export const fixtureWorkflowSettingsD = makeFixture(workflowSettings[3]);
export const fixtureWorkflowSettingsE = makeFixture(workflowSettings[4]);

export const fixtureWorkflowA = makeFixture(workflows[0]);
export const fixtureWorkflowB = makeFixture(workflows[1]);
export const fixtureWorkflowC = makeFixture(workflows[2]);
export const fixtureWorkflowD = makeFixture(workflows[3]);
export const fixtureWorkflowE = makeFixture(workflows[4]);
