/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { deleteWorkflowsSubCase } from '@/application/useCases/workflow/subs/deleteWorkflows';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWidgetDInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl, fixtureWorkflowCInColl, fixtureWorkflowDInColl } from '@tests/base/state/fixtures/entitiesState';

describe('deleteWorkflowsSubCase()', () => {
  it('should remove specified ids from the project\'s workflow ids list', () => {
    const state = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowBInColl({ id: 'WFL-2' }),
          ...fixtureWorkflowCInColl({ id: 'WFL-3' }),
          ...fixtureWorkflowDInColl({ id: 'WFL-NOT-IN-PROJECT' }),
        },
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-1', workflowIds: ['WFL-1', 'WFL-2', 'WFL-3', 'WFL-4'], currentWorkflowId: 'WFL-1' })
        }
      }
    })

    const newState = deleteWorkflowsSubCase(['WFL-2', 'WFL-3', 'WFL-NOT-IN-PROJECT'], 'PRJ-1', state, () => { })

    expect(newState.entities.projects['PRJ-1']?.workflowIds).toEqual(['WFL-1', 'WFL-4'])
  })

  it('should not update currentWorkflowId if it is not deleted', () => {
    const state = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({ id: 'WFL-1' }),
        },
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-1', workflowIds: ['WFL-1', 'WFL-2'], currentWorkflowId: 'WFL-2' })
        }
      }
    })

    const newState = deleteWorkflowsSubCase(['WFL-1'], 'PRJ-1', state, () => { })

    expect(newState.entities.projects['PRJ-1']?.currentWorkflowId).toEqual('WFL-2')
  })

  it('should correctly update currentWorkflowId if it is deleted', () => {
    const state = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowBInColl({ id: 'WFL-2' }),
          ...fixtureWorkflowCInColl({ id: 'WFL-3' }),
          ...fixtureWorkflowDInColl({ id: 'WFL-NOT-IN-PROJECT' }),
        },
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-1', workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })
        }
      }
    })

    const newState = deleteWorkflowsSubCase(['WFL-2', 'WFL-3', 'WFL-NOT-IN-PROJECT'], 'PRJ-1', state, () => { })

    expect(newState.entities.projects['PRJ-1']?.currentWorkflowId).toEqual('WFL-1')
  })

  it('should correctly delete workflow entities', () => {
    const state = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowBInColl({ id: 'WFL-2' }),
          ...fixtureWorkflowCInColl({ id: 'WFL-3' }),
          ...fixtureWorkflowDInColl({ id: 'WFL-NOT-IN-PROJECT' }),
        },
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-1', workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })
        }
      }
    })

    const newState = deleteWorkflowsSubCase(['WFL-2', 'WFL-3', 'WFL-NOT-IN-PROJECT'], 'PRJ-1', state, () => { })

    expect(newState.entities.workflows).toEqual({
      ['WFL-NOT-IN-PROJECT']: state.entities.workflows['WFL-NOT-IN-PROJECT']
    })
  })

  it('should correctly delete widget entities', () => {
    const state = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: 'WGT-1' }),
          ...fixtureWidgetBInColl({ id: 'WGT-2' }),
          ...fixtureWidgetCInColl({ id: 'WGT-3' }),
          ...fixtureWidgetDInColl({ id: 'WGT-4' }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: 'WFL-1', layout: [fixtureWidgetLayoutItemA({ widgetId: 'WGT-1' })] }),
          ...fixtureWorkflowBInColl({ id: 'WFL-2', layout: [fixtureWidgetLayoutItemB({ widgetId: 'WGT-2' }), fixtureWidgetLayoutItemC({ widgetId: 'WGT-3' })] }),
          ...fixtureWorkflowCInColl({ id: 'WFL-3', layout: [] }),
          ...fixtureWorkflowDInColl({ id: 'WFL-4', layout: [] }),
        },
        projects: {
          ...fixtureProjectAInColl({ id: 'PRJ-1', workflowIds: ['WFL-1', 'WFL-2', 'WFL-3'], currentWorkflowId: 'WFL-3' })
        }
      }
    })

    const newState = deleteWorkflowsSubCase(['WFL-1', 'WFL-2', 'WFL-3', 'WFL-4'], 'PRJ-1', state, () => { })

    expect(newState.entities.widgets).toEqual({
      ['WGT-4']: state.entities.widgets['WGT-4']
    })
  })

})
