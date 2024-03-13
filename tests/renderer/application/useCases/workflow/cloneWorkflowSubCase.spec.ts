/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloneWorkflowSubCase } from '@/application/useCases/workflow/cloneWorkflowSubCase';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { jest } from '@jest/globals';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { fixtureEntitiesState, fixtureWidgetAInColl, fixtureWidgetBInColl } from '@tests/base/state/fixtures/entitiesState';
import { CloneWidgetLayoutItemSubCase } from '@/application/useCases/widgetLayout/cloneWidgetLayoutItemSubCase';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { EntitiesState } from '@/base/state/entities';

function setup() {
  const idGeneratorMock = jest.fn<IdGenerator>().mockImplementation(() => 'SOME-ID');
  const cloneWidgetLayoutItemSubCase = jest.fn<CloneWidgetLayoutItemSubCase>().mockImplementation(async (_item, state) => [null, state]);
  const cloneWorkflowSubCase = createCloneWorkflowSubCase({
    idGenerator: idGeneratorMock,
    cloneWidgetLayoutItemSubCase
  });

  return {
    cloneWorkflowSubCase,
    idGeneratorMock,
    cloneWidgetLayoutItemSubCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWorkflowSubCase()', () => {
  it('should return null id and unchanged entities state, if there is no workflow id in the entities state', async () => {
    const initState = fixtureEntitiesState({
      workflows: {}
    })
    const {
      cloneWorkflowSubCase
    } = setup()
    const expectState = initState;

    const [gotId, gotState] = await cloneWorkflowSubCase('NO-SUCH-ID', initState);

    expect(gotId).toBeNull();
    expect(gotState).toBe(expectState);
  })

  it('should correctly clone Workflow in the entities state', async () => {
    const workflow = fixtureWorkflowA({
      id: 'WORKFLOW-ID', layout: [
        fixtureWidgetLayoutItemA({ id: 'WL-A' }),
        fixtureWidgetLayoutItemB({ id: 'WL-B' }),
        fixtureWidgetLayoutItemC({ id: 'WL-C' }),
      ]
    })
    const newWorkflow = fixtureWorkflowA({
      id: 'NEW-WORKFLOW-ID', layout: [
        fixtureWidgetLayoutItemA({ id: 'NEW-WL-A' }),
        fixtureWidgetLayoutItemC({ id: 'NEW-WL-C' }),
      ]
    })
    const initState = fixtureEntitiesState({
      workflows: {
        [workflow.id]: workflow
      }
    })
    const {
      cloneWorkflowSubCase,
      cloneWidgetLayoutItemSubCase,
      idGeneratorMock
    } = setup()
    const stateAfterCloneWLItemA = fixtureEntitiesState({
      ...initState,
      widgets: {
        ...initState.widgets,
        ...fixtureWidgetAInColl()
      }
    })
    const stateAfterCloneWLItemB = stateAfterCloneWLItemA;
    const stateAfterCloneWLItemC = fixtureEntitiesState({
      ...initState,
      widgets: {
        ...initState.widgets,
        ...fixtureWidgetBInColl()
      }
    })
    const stateFinal: EntitiesState = {
      ...stateAfterCloneWLItemC,
      workflows: {
        ...stateAfterCloneWLItemC.workflows,
        [newWorkflow.id]: newWorkflow
      }
    }
    cloneWidgetLayoutItemSubCase.mockResolvedValueOnce([newWorkflow.layout[0], stateAfterCloneWLItemA]);
    cloneWidgetLayoutItemSubCase.mockResolvedValueOnce([null, stateAfterCloneWLItemB]);
    cloneWidgetLayoutItemSubCase.mockResolvedValueOnce([newWorkflow.layout[1], stateAfterCloneWLItemC]);
    idGeneratorMock.mockImplementationOnce(() => newWorkflow.id)

    const [gotId, gotState] = await cloneWorkflowSubCase(workflow.id, initState);

    expect(gotId).toBe(newWorkflow.id);
    expect(gotState).toEqual(stateFinal);
  })
})
