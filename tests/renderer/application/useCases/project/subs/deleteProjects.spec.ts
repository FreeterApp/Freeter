/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { deleteProjectsSubCase } from '@/application/useCases/project/subs/deleteProjects';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC } from '@tests/base/fixtures/project';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowD, fixtureWorkflowE } from '@tests/base/fixtures/workflow';

describe('deleteProjectsSubCase()', () => {
  it('should remove specified ids from the project ids list', () => {
    const [updPrjIdList] = deleteProjectsSubCase(['P-2', 'P-3', 'NO-ID'], ['P-1', 'P-2', 'P-3', 'P-4'], 'P-2', {}, {})

    expect(updPrjIdList).toEqual(['P-1', 'P-4'])
  })

  it('should not update currentProjectId if it is not deleted', () => {
    const [, updCurPrjId] = deleteProjectsSubCase(['P-1'], ['P-1', 'P-2'], 'P-2', {}, {})

    expect(updCurPrjId).toBe('P-2')
  })

  it('should correctly update currentProjectId if it is deleted', () => {
    const [, updCurPrjId] = deleteProjectsSubCase(['P-2', 'P-3', 'NO-ID'], ['P-1', 'P-2', 'P-3'], 'P-3', {}, {})

    expect(updCurPrjId).toBe('P-1')
  })

  it('should return ids of projects deleted from the project ids list', () => {
    const [, , delPrjIds] = deleteProjectsSubCase(['P-2', 'P-3', 'NO-ID'], ['P-1', 'P-2', 'P-3'], 'P-3', {}, {})

    expect(delPrjIds).toEqual(['P-2', 'P-3'])
  })

  it('should return ids of workflows and widgets deleted with the projects', () => {
    const [, , , delWflIds, delWgtIds] = deleteProjectsSubCase(['P-2', 'P-3', 'NO-ID'], ['P-1', 'P-2', 'P-3'], 'P-3', {
      'P-2': fixtureProjectA({ id: 'P-2', workflowIds: ['WFL-1', 'WFL-2'] }),
      'P-3': fixtureProjectB({ id: 'P-3', workflowIds: ['WFL-3', 'WFL-4'] }),
      'P-1': fixtureProjectC({ id: 'P-1', workflowIds: ['WFL-5'] })
    }, {
      'WFL-1': fixtureWorkflowA({ id: 'WFL-1', layout: [fixtureWidgetLayoutItemA({ widgetId: 'WGT-1' })] }),
      'WFL-2': fixtureWorkflowB({ id: 'WFL-2', layout: [fixtureWidgetLayoutItemB({ widgetId: 'WGT-2' }), fixtureWidgetLayoutItemC({ widgetId: 'WGT-3' })] }),
      'WFL-3': fixtureWorkflowC({ id: 'WFL-3', layout: [fixtureWidgetLayoutItemD({ widgetId: 'WGT-4' })] }),
      'WFL-4': fixtureWorkflowD({ id: 'WFL-4', layout: [] }),
      'WFL-5': fixtureWorkflowE({ id: 'WFL-5', layout: [] }),
    })

    expect(delWflIds).toEqual(['WFL-1', 'WFL-2', 'WFL-3', 'WFL-4'])
    expect(delWgtIds).toEqual(['WGT-1', 'WGT-2', 'WGT-3', 'WGT-4'])
  })

})
