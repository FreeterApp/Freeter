/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddWidgetToWorkflowUseCase } from '@/application/useCases/palette/addWidgetToWorkflow';
import { addWidgetToAppState } from '@/base/state/actions';
import { AppState } from '@/base/state/app';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const newItemId = 'NEW-ITEM-ID';

jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual('@/base/state/actions');
  return {
    ...actual,
    addWidgetToAppState: jest.fn(actual.addWidgetToAppState),
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const addWidgetToWorkflowUseCase = createAddWidgetToWorkflowUseCase({
    appStore,
    idGenerator: () => newItemId,
  });
  return {
    appStore,
    addWidgetToAppState,
    addWidgetToWorkflowUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addWidgetToWorkflowUseCase()', () => {
  it('should correctly add a new widget with size=minSize of the clicked type to the widget layout at a free area, using addWidgetToAppState', async () => {
    const workflowId = 'WORKFLOW-ID';
    const widgetTypeId = 'WIDGET-TYPE-ID';
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl(),
        },
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
            minSize: {
              w: 3,
              h: 3
            },
          })
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
            layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 2, y: 2, w: 2, h: 2 } }),
              fixtureWidgetLayoutItemB({ rect: { x: 6, y: 0, w: 10, h: 3 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 7, y: 4, w: 9, h: 2 } }),
            ]
          })
        }
      },
    });
    const {
      appStore,
      addWidgetToAppState,
      addWidgetToWorkflowUseCase
    } = await setup(initState)

    addWidgetToWorkflowUseCase(widgetTypeId, workflowId);

    const gotState = appStore.get();
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newItemId]: expect.objectContaining({
            id: newItemId,
            type: widgetTypeId,
          })
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowId]: {
            ...initState.entities.workflows[workflowId]!,
            layout: expect.arrayContaining([...initState.entities.workflows[workflowId]!.layout, {
              id: newItemId,
              rect: { x: 4, y: 3, w: 3, h: 3 },
              widgetId: newItemId
            }])
          }
        }
      },
    }
    expect(gotState).toEqual(expectState);
    expect(addWidgetToAppState).toBeCalledTimes(1);
  })

  it('should do nothing, if widget type with specified id does not exist', async () => {
    const workflowId = 'WORKFLOW-ID';
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
          })
        }
      },
    });
    const {
      appStore,
      addWidgetToWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    addWidgetToWorkflowUseCase('NO-SUCH-ID', workflowId);

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if workflow with specified id does not exist', async () => {
    const widgetTypeId = 'WIDGET-TYPE-ID';
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId
          })
        },
        workflows: {
          ...fixtureWorkflowAInColl()
        }
      },
    });
    const {
      appStore,
      addWidgetToWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    addWidgetToWorkflowUseCase(widgetTypeId, 'NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
  })
})
