/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCloneWorkflowSubCase } from '@/application/useCases/workflow/cloneWorkflowSubCase';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetLayoutItemSubCase } from '@/application/useCases/workflow/cloneWidgetLayoutItemSubCase';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { WorkflowEntityDeps } from '@/base/state/entities';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { fixtureWidgetA, fixtureWidgetB } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { Workflow } from '@/base/workflow';

function setup() {
  const workflowIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WF-ID');
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-W-ID')
  const widgetLayoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID')
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const cloneWidgetLayoutItemSubCase = createCloneWidgetLayoutItemSubCase({
    cloneWidgetSubCase,
    idGenerator: widgetLayoutItemIdGeneratorMock
  })
  const cloneWorkflowSubCase = createCloneWorkflowSubCase({
    cloneWidgetLayoutItemSubCase,
    idGenerator: workflowIdGeneratorMock
  });

  return {
    cloneWorkflowSubCase,
    workflowIdGeneratorMock,
    widgetIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('cloneWorkflowSubCase()', () => {
  it('should correctly clone Workflow in the entities state and return new entities', async () => {
    const widgetA = fixtureWidgetA()
    const widgetAClone: Widget = { ...widgetA, id: widgetA.id + 'CLONE' }
    const widgetB = fixtureWidgetB()
    const widgetBClone: Widget = { ...widgetB, id: widgetB.id + 'CLONE' }
    const workflow = fixtureWorkflowA({
      layout: [
        fixtureWidgetLayoutItemA({ widgetId: widgetA.id }),
        fixtureWidgetLayoutItemB({ widgetId: 'NO-SUCH-ID' }),
        fixtureWidgetLayoutItemC({ widgetId: widgetB.id }),
      ]
    })
    const workflowClone: Workflow = {
      ...workflow,
      id: workflow.id + 'CLONE', layout: [
        { ...workflow.layout[0], id: workflow.layout[0].id + 'CLONE', widgetId: widgetAClone.id },
        { ...workflow.layout[2], id: workflow.layout[2].id + 'CLONE', widgetId: widgetBClone.id },
      ]
    }
    const workflowEntitydeps: WorkflowEntityDeps = {
      widgets: {
        [widgetA.id]: widgetA,
        [widgetB.id]: widgetB,
      }
    }
    const {
      cloneWorkflowSubCase,
      workflowIdGeneratorMock,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock
    } = setup()
    workflowIdGeneratorMock.mockReturnValueOnce(workflowClone.id);
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(workflowClone.layout[0].id);
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(workflowClone.layout[1].id);
    widgetIdGeneratorMock.mockReturnValueOnce(widgetAClone.id);
    widgetIdGeneratorMock.mockReturnValueOnce(widgetBClone.id);

    const [gotWfl, newWidgets] = await cloneWorkflowSubCase(workflow, workflowEntitydeps);

    expect(gotWfl).toEqual(workflowClone);
    expect(newWidgets).toEqual([widgetAClone, widgetBClone]);
  })
})
