/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createPasteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/pasteWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC } from '@tests/base/fixtures/workflow';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { createCloneWorkflowSubCase } from '@/application/useCases/workflow/cloneWorkflowSubCase';
import { createCloneWidgetLayoutItemSubCase } from '@/application/useCases/workflow/cloneWidgetLayoutItemSubCase';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { Workflow } from '@/base/workflow';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const workflowIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WFL-ID')
  const widgetLayoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID')
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WGT-ID')
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
  })
  const pasteWorkflowUseCase = createPasteWorkflowUseCase({
    appStore,
    cloneWorkflowSubCase,
  });
  return {
    appStore,
    pasteWorkflowUseCase,
    workflowIdGeneratorMock,
    widgetIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock
  }
}

describe('pasteWorkflowUseCase()', () => {
  it('should do nothing, if no id in copied workflows', async () => {
    const workflowA = fixtureWorkflowA();
    const projectA = fixtureProjectA();
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        }
      },
      ui: {
        copy: fixtureCopyState({
          workflows: {
            entities: {
              'A': { id: 'A', deps: { widgets: {} }, entity: fixtureWorkflowA() }
            },
            list: ['A']
          }
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      appStore,
      pasteWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    await pasteWorkflowUseCase('NO-SUCH-ID', workflowA.id);

    expect(appStore.get()).toBe(expectState);
  })

  it('should add a clone of the copied workflow to entities and its id to the current project\'s workflow ids', async () => {
    const widgetA = fixtureWidgetA();
    const widgetAClone: Widget = { ...widgetA, id: widgetA.id + 'CLONE' }
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const workflowB = fixtureWorkflowB();
    const workflowC = fixtureWorkflowC();
    const workflowAClone: Workflow = { ...workflowA, id: workflowA.id + 'CLONE', settings: { ...workflowA.settings, name: workflowA.settings.name + ' Copy 1' }, layout: [{ ...workflowA.layout[0], id: workflowA.layout[0].id + 'CLONE', widgetId: widgetAClone.id }] }
    const projectA = fixtureProjectA({ workflowIds: [workflowB.id, workflowC.id] });
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
          [workflowC.id]: workflowC,
        },
        projects: {
          [projectA.id]: projectA
        }
      },
      ui: {
        copy: fixtureCopyState({
          workflows: {
            entities: {
              'A': { id: 'A', deps: { widgets: { [widgetA.id]: widgetA } }, entity: workflowA }
            },
            list: ['A']
          }
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        workflows: {
          ...initState.entities.workflows,
          [workflowAClone.id]: workflowAClone
        },
        widgets: {
          ...initState.entities.widgets,
          [widgetAClone.id]: widgetAClone
        },
        projects: {
          ...initState.entities.projects,
          [projectA.id]: {
            ...projectA,
            workflowIds: [workflowB.id, workflowAClone.id, workflowC.id],
            currentWorkflowId: workflowAClone.id
          }
        }
      }
    }
    const {
      appStore,
      pasteWorkflowUseCase,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock,
      workflowIdGeneratorMock
    } = await setup(initState)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetAClone.id)
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(workflowAClone.layout[0].id)
    workflowIdGeneratorMock.mockReturnValueOnce(workflowAClone.id)

    await pasteWorkflowUseCase('A', workflowC.id);

    expect(appStore.get()).toEqual(expectState);
  })
})
