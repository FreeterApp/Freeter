/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { deleteWorkflowsSubCase } from '@/application/useCases/workflow/subs/deleteWorkflows';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowD } from '@tests/base/fixtures/workflow';

describe('deleteWorkflowsSubCase()', () => {
  it('should remove specified ids from the project\'s workflow ids list', () => {
    const delWfls = [
      fixtureWorkflowB({ id: 'WFL-2' }),
      fixtureWorkflowC({ id: 'WFL-3' }),
      fixtureWorkflowD({ id: 'WFL-NOT-IN-PROJECT' }),
    ]
    const prj = fixtureProjectA({ workflowIds: ['WFL-1', 'WFL-2', 'WFL-3', 'WFL-4'], currentWorkflowId: 'WFL-1' })

    const [updPrj] = deleteWorkflowsSubCase(delWfls, prj)

    expect(updPrj.workflowIds).toEqual(['WFL-1', 'WFL-4'])
  })

  it('should not update currentWorkflowId if it is not deleted', () => {
    const delWfls = [
      fixtureWorkflowA({ id: 'WFL-1' }),
    ]
    const prj = fixtureProjectA({ workflowIds: ['WFL-1', 'WFL-2'], currentWorkflowId: 'WFL-2' })

    const [updPrj] = deleteWorkflowsSubCase(delWfls, prj)

    expect(updPrj.currentWorkflowId).toEqual('WFL-2')
  })

  it('should correctly update currentProjectId if it is deleted', () => {
    const delWfls = [
      fixtureWorkflowB({ id: 'WFL-2' }),
      fixtureWorkflowC({ id: 'WFL-3' }),
      fixtureWorkflowD({ id: 'WFL-NOT-IN-PROJECT' }),
    ]
    const prj = fixtureProjectA({ workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })

    const [updPrj] = deleteWorkflowsSubCase(delWfls, prj)

    expect(updPrj.currentWorkflowId).toEqual('WFL-1')
  })

  it('should return ids of workflows deleted from the project\'s workflow ids', () => {
    const delWfls = [
      fixtureWorkflowB({ id: 'WFL-2' }),
      fixtureWorkflowC({ id: 'WFL-3' }),
      fixtureWorkflowD({ id: 'WFL-NOT-IN-PROJECT' }),
    ]
    const prj = fixtureProjectA({ workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })

    const [, delWflIds] = deleteWorkflowsSubCase(delWfls, prj)

    expect(delWflIds).toEqual(['WFL-2', 'WFL-3'])
  })

  it('should return ids of widgets deleted with the workflows', () => {
    const delWfls = [
      fixtureWorkflowA({ id: 'WFL-1', layout: [fixtureWidgetLayoutItemA({ widgetId: 'WGT-1' })] }),
      fixtureWorkflowB({ id: 'WFL-2', layout: [fixtureWidgetLayoutItemB({ widgetId: 'WGT-2' }), fixtureWidgetLayoutItemC({ widgetId: 'WGT-3' })] }),
      fixtureWorkflowC({ id: 'WFL-3', layout: [fixtureWidgetLayoutItemD({ widgetId: 'WGT-4' })] }),
      fixtureWorkflowD({ id: 'WFL-4', layout: [] }),
    ]
    const prj = fixtureProjectA({ workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })

    const [, , delWgtIds] = deleteWorkflowsSubCase(delWfls, prj)

    expect(delWgtIds).toEqual(['WGT-1', 'WGT-2', 'WGT-3', 'WGT-4'])
  })

})
