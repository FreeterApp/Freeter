/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createPasteWidgetToWorkflowUseCase } from '@/application/useCases/workflow/pasteWidgetToWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { createAddWidgetToWidgetLayoutSubCase } from '@/application/useCases/workflow/addWidgetToWidgetLayoutSubCase';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureWidgetTypeA } from '@tests/base/fixtures/widgetType';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const widgetLayoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID')
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-W-ID')
  const addWidgetToWidgetLayoutSubCase = createAddWidgetToWidgetLayoutSubCase({
    idGenerator: widgetLayoutItemIdGeneratorMock
  })
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const pasteWidgetToWorkflowUseCase = createPasteWidgetToWorkflowUseCase({
    appStore,
    cloneWidgetSubCase,
    addWidgetToWidgetLayoutSubCase,
  });
  return {
    appStore,
    pasteWidgetToWorkflowUseCase,
    widgetIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock
  }
}

describe('pasteWidgetToWorkflowUseCase()', () => {
  it('should do nothing, if no id in copied widgets', async () => {
    const workflowA = fixtureWorkflowA();
    const widgetTypeA = fixtureWidgetTypeA();
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              'A': { id: 'A', deps: [], entity: fixtureWidgetA({ type: widgetTypeA.id }) }
            },
            list: ['A']
          }
        }),
      }
    })
    const {
      appStore,
      pasteWidgetToWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    await pasteWidgetToWorkflowUseCase('NO-SUCH-ID', workflowA.id);

    expect(appStore.get()).toBe(expectState);
  })

  it('should add a clone of the copied widget to entities and Workflow', async () => {
    const workflowA = fixtureWorkflowA({
      layout: [
        fixtureWidgetLayoutItemA({ rect: { x: 0, y: 0, w: 2, h: 2 } }),
        fixtureWidgetLayoutItemB({ rect: { x: 2, y: 1, w: 2, h: 2 } }),
      ]
    });
    const widgetTypeA = fixtureWidgetTypeA({ minSize: { w: 2, h: 2 } });
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id });
    const widgetAClone: Widget = { ...widgetA, id: widgetA.id + 'CLONE' }
    const newWidgetLayoutItem = fixtureWidgetLayoutItemC({ widgetId: widgetAClone.id, rect: { x: 4, y: 0, w: 2, h: 2 } })
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              'A': { id: 'A', deps: [], entity: widgetA },
              'B': { id: 'B', deps: [], entity: fixtureWidgetB() }
            },
            list: ['A', 'B']
          }
        }),
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [widgetAClone.id]: widgetAClone
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowA.id]: {
            ...workflowA,
            layout: [...workflowA.layout, newWidgetLayoutItem]
          }
        }
      },
    }
    const {
      appStore,
      pasteWidgetToWorkflowUseCase,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock,
    } = await setup(initState)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetAClone.id)
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(newWidgetLayoutItem.id)

    await pasteWidgetToWorkflowUseCase('A', workflowA.id);

    expect(appStore.get()).toEqual(expectState);
  })
})
