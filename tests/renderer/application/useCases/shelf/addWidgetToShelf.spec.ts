/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createAddWidgetToShelfUseCase } from '@/application/useCases/shelf/addWidgetToShelf';
import { addWidgetToAppState } from '@/base/state/actions';
import { AppState } from '@/base/state/app';
import { fixtureWidgetListItemA, fixtureWidgetListItemB } from '@tests/base/fixtures/widgetList';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureShelf } from '@tests/base/state/fixtures/shelf';
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
  const addWidgetToShelfUseCase = createAddWidgetToShelfUseCase({
    appStore,
    idGenerator: () => newItemId,
  });
  return {
    appStore,
    addWidgetToAppState,
    addWidgetToShelfUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addWidgetToShelfUseCase()', () => {
  it('should correctly add a new widget to the widget list, using addWidgetToAppState', async () => {
    const widgetTypeId = 'WIDGET-TYPE-ID';
    const initState = fixtureAppState({
      entities: {
        widgets: {
          ...fixtureWidgetAInColl(),
        },
        widgetTypes: {
          ...fixtureWidgetTypeAInColl({
            id: widgetTypeId,
          })
        },
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
        })
      }
    });
    const {
      appStore,
      addWidgetToAppState,
      addWidgetToShelfUseCase
    } = await setup(initState)

    addWidgetToShelfUseCase(widgetTypeId, initState.ui.shelf.widgetList[1].id);

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
      },
      ui: {
        ...initState.ui,
        shelf: {
          ...initState.ui.shelf,
          widgetList: [
            initState.ui.shelf.widgetList[0],
            expect.objectContaining({
              id: newItemId,
              widgetId: newItemId
            }),
            initState.ui.shelf.widgetList[1],
          ]
        }
      }
    }
    expect(gotState).toEqual(expectState);
    expect(addWidgetToAppState).toBeCalledTimes(1);
  })

  it('should do nothing, if widget type with specified id does not exist', async () => {
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          ...fixtureWidgetTypeAInColl()
        },
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [fixtureWidgetListItemA()]
        })
      }
    });
    const {
      appStore,
      addWidgetToShelfUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    addWidgetToShelfUseCase('NO-SUCH-ID', null);

    expect(appStore.get()).toBe(expectState);
  })

})
