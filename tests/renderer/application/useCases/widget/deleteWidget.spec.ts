/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDeleteWidgetUseCase } from '@/application/useCases/widget/deleteWidget';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureWidgetAInColl, fixtureWidgetBInColl } from '@tests/base/state/fixtures/entitiesState';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';
import { deleteWidgetsFromAppState } from '@/base/state/actions';
import { fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';

jest.mock('@/base/state/actions');
const mockedDeleteWidgetsFromAppState = jest.mocked(deleteWidgetsFromAppState);

async function setup(initState: AppState, opts?: { mockShowMessageBoxRes?: number, mockDeleteWidgetsFromAppStateRes?: AppState }) {
  const [appStore] = await fixtureAppStore(initState);
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn().mockResolvedValue({
      response: opts?.mockShowMessageBoxRes !== undefined ? opts.mockShowMessageBoxRes : 1
    } as MessageBoxResult)
  }

  if (opts?.mockDeleteWidgetsFromAppStateRes) {
    mockedDeleteWidgetsFromAppState.mockClear();
    mockedDeleteWidgetsFromAppState.mockImplementation(() => opts.mockDeleteWidgetsFromAppStateRes!)
  } else {
    mockedDeleteWidgetsFromAppState.mockRestore();
  }

  const deleteWidgetUseCase = createDeleteWidgetUseCase({
    appStore,
    dialog: dialogProviderMock
  });
  return {
    appStore,
    dialogProviderMock,
    mockedDeleteWidgetsFromAppState,
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

  it('should call deleteWidgetsFromAppState with right params, and update the state in the store with the returned value, when the message box returns "Ok"', async () => {
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
    })
    const updState = {
      ...initState,
      widgets: {} // we don't need the correct result here
    };
    const {
      appStore,
      deleteWidgetUseCase,
      mockedDeleteWidgetsFromAppState,
    } = await setup(initState, { mockShowMessageBoxRes: 0, mockDeleteWidgetsFromAppStateRes: updState })

    await deleteWidgetUseCase(widgetId1, widgetEnv);

    expect(mockedDeleteWidgetsFromAppState).toBeCalledTimes(1);
    expect(mockedDeleteWidgetsFromAppState).toBeCalledWith(initState, widgetEnv, [widgetId1])
    expect(appStore.get()).toStrictEqual(updState);
  })
})
