/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDeleteWidgetUseCase } from '@/application/useCases/widget/deleteWidget';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';
import { fixtureWidgetEnvAreaShelf, fixtureWidgetEnvAreaWorkflow } from '@tests/base/fixtures/widget';
import { mockDialogProvider } from '@tests/infra/mocks/dialogProvider';
import { fixtureShelf } from '@tests/base/state/fixtures/shelf';
import { fixtureWidgetListItemA, fixtureWidgetListItemB } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB } from '@tests/base/fixtures/widgetLayout';


async function setup(initState: AppState, opts?: { mockShowMessageBoxRes?: number }) {
  const [appStore] = await fixtureAppStore(initState);
  const dialogProviderMock = mockDialogProvider({
    showMessageBox: jest.fn().mockResolvedValue({
      response: opts?.mockShowMessageBoxRes !== undefined ? opts.mockShowMessageBoxRes : 1
    } as MessageBoxResult),
  })

  const deleteWidgetUseCase = createDeleteWidgetUseCase({
    appStore,
    dialog: dialogProviderMock
  });
  return {
    appStore,
    dialogProviderMock,
    deleteWidgetUseCase,
  }
}

describe('deleteWidgetUseCase()', () => {

  it('should do nothing, if the specified widget does not exist', async () => {
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
        }
      },
    })
    const {
      appStore,
      deleteWidgetUseCase,
      dialogProviderMock
    } = await setup(initState)

    const expectState = appStore.get();
    await deleteWidgetUseCase('NO-SUCH-ID', fixtureWidgetEnvAreaShelf());

    expect(appStore.get()).toBe(expectState);
    expect(dialogProviderMock.showMessageBox).not.toBeCalled();
  })

  it('should show a message box asking for a Ok/Cancel confirmation', async () => {
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
        }
      },
    })
    const {
      deleteWidgetUseCase,
      dialogProviderMock
    } = await setup(initState)

    await deleteWidgetUseCase(widgetId1, fixtureWidgetEnvAreaShelf());

    expect(dialogProviderMock.showMessageBox).toBeCalled();
    expect(dialogProviderMock.showMessageBox).toBeCalledWith(expect.objectContaining({ buttons: ['Ok', 'Cancel'] } as MessageBoxConfig));
  })

  it('should do nothing, when the message box returns "Cancel"', async () => {
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
        }
      },
    })
    const {
      appStore,
      deleteWidgetUseCase,
    } = await setup(initState, { mockShowMessageBoxRes: 1 })

    const expectState = appStore.get();
    await deleteWidgetUseCase(widgetId1, fixtureWidgetEnvAreaShelf());

    expect(appStore.get()).toBe(expectState);
  })

  it('should correctly update the state, when the deleted widget is on Shelf', async () => {
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const widgetEnv = fixtureWidgetEnvAreaShelf();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
        }
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [fixtureWidgetListItemA({ widgetId: widgetId1 }), fixtureWidgetListItemB({ widgetId: widgetId2 })]
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          [widgetId2]: initState.entities.widgets[widgetId2]
        }
      },
      ui: {
        ...initState.ui,
        shelf: {
          ...initState.ui.shelf,
          widgetList: [initState.ui.shelf.widgetList[1]]
        }
      }
    }
    const {
      appStore,
      deleteWidgetUseCase,
    } = await setup(initState, { mockShowMessageBoxRes: 0 })

    await deleteWidgetUseCase(widgetId1, widgetEnv);

    expect(appStore.get()).toEqual(expectState);
  })

  it('should correctly update the state, when the deleted widget is on Workflow', async () => {
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const workflowId1 = 'WORKFLOW-ID1';
    const widgetEnv = fixtureWidgetEnvAreaWorkflow({ workflowId: workflowId1 });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 }),
            ]
          })
        }
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          [widgetId2]: initState.entities.widgets[widgetId2]
        },
        workflows: {
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [initState.entities.workflows[workflowId1]!.layout[1]]
          }
        }
      },
    }
    const {
      appStore,
      deleteWidgetUseCase,
    } = await setup(initState, { mockShowMessageBoxRes: 0 })

    await deleteWidgetUseCase(widgetId1, widgetEnv);

    expect(appStore.get()).toEqual(expectState);
  })
})
