/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Project, ProjectSettings } from '@/base/project';
import { makeFixture } from '@utils/makeFixture';

const projectSettings: ProjectSettings[] = [{
  memSaver: {},
  name: 'Project A',
}, {
  memSaver: {},
  name: 'Project B',
}, {
  memSaver: {},
  name: 'Project C',
}, {
  memSaver: {},
  name: 'Project D',
}]

const projects: Project[] = [{
  id: 'P-A',
  settings: projectSettings[0],
  workflowIds: ['P-A-W-A', 'P-A-W-B', 'P-A-W-C', 'P-A-W-D'],
  currentWorkflowId: 'P-A-W-A'
}, {
  id: 'P-B',
  settings: projectSettings[1],
  workflowIds: ['P-B-W-A', 'P-B-W-B', 'P-B-W-C', 'P-B-W-D'],
  currentWorkflowId: 'P-B-W-A'
}, {
  id: 'P-C',
  settings: projectSettings[2],
  workflowIds: ['P-C-W-A', 'P-C-W-B', 'P-C-W-C', 'P-C-W-D'],
  currentWorkflowId: 'P-C-W-A'
}, {
  id: 'P-D',
  settings: projectSettings[3],
  workflowIds: ['P-D-W-A', 'P-D-W-B', 'P-D-W-C', 'P-D-W-D'],
  currentWorkflowId: 'P-D-W-A'
}];

export const fixtureProjectSettingsA = makeFixture(projectSettings[0]);
export const fixtureProjectSettingsB = makeFixture(projectSettings[1]);
export const fixtureProjectSettingsC = makeFixture(projectSettings[2]);
export const fixtureProjectSettingsD = makeFixture(projectSettings[3]);

export const fixtureProjectA = makeFixture(projects[0]);
export const fixtureProjectB = makeFixture(projects[1]);
export const fixtureProjectC = makeFixture(projects[2]);
export const fixtureProjectD = makeFixture(projects[3]);
