/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { MemSaverConfigApp, MemSaverWorkflow } from '@/base/memSaver';
import { makeFixture } from '@utils/makeFixture';

const memSaverWorkflows: MemSaverWorkflow[] = [
  {
    prjId: 'P-A',
    wflId: 'W-A'
  },
  {
    prjId: 'P-B',
    wflId: 'W-B'
  },
  {
    prjId: 'P-C',
    wflId: 'W-C'
  },
  {
    prjId: 'P-D',
    wflId: 'W-D'
  },
]

const memSaverConfigApp: MemSaverConfigApp = {
  activateWorkflowsOnProjectSwitch: false,
  workflowInactiveAfter: -1
}

export const fixtureMemSaverConfigApp = makeFixture(memSaverConfigApp);

export const fixtureMemSaverWorkflowA = makeFixture(memSaverWorkflows[0]);
export const fixtureMemSaverWorkflowB = makeFixture(memSaverWorkflows[1]);
export const fixtureMemSaverWorkflowC = makeFixture(memSaverWorkflows[2]);
export const fixtureMemSaverWorkflowD = makeFixture(memSaverWorkflows[3]);
