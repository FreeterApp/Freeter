/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createAddWidgetToShelfUseCase } from '@/application/useCases/shelf/addWidgetToShelf';
import { createAddItemToWidgetListSubCase } from '@/application/useCases/shelf/subs/addItemToWidgetList';
import { createCreateWidgetSubCase } from '@/application/useCases/widget/subs/createWidget';
import { AppState } from '@/base/state/app';
import { fixtureWidgetListItemA, fixtureWidgetListItemB } from '@tests/base/fixtures/widgetList';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetTypeAInColl, fixtureWidgetAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureShelf } from '@tests/base/state/fixtures/shelf';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const newWidgetId = 'NEW-WIDGET-ID';
const newListItemtId = 'NEW-LIST-ITEM-ID';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newWidgetId)
  const layoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newListItemtId)
  const createWidgetSubCase = createCreateWidgetSubCase({
    idGenerator: widgetIdGeneratorMock
  })
  const addItemToWidgetListSubCase = createAddItemToWidgetListSubCase({
    idGenerator: layoutItemIdGeneratorMock
  })
  const addWidgetToShelfUseCase = createAddWidgetToShelfUseCase({
    appStore,
    addItemToWidgetListSubCase,
    createWidgetSubCase,
  });
  return {
    appStore,
    addWidgetToShelfUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addWidgetToShelfUseCase()', () => {
  it('should correctly add a new widget to the widget list', async () => {
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
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({
            id: newWidgetId,
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
              id: newListItemtId,
              widgetId: newWidgetId
            }),
            initState.ui.shelf.widgetList[1],
          ]
        }
      }
    }

    const {
      appStore,
      addWidgetToShelfUseCase
    } = await setup(initState)

    addWidgetToShelfUseCase(widgetTypeId, initState.ui.shelf.widgetList[1].id);

    const gotState = appStore.get();
    expect(gotState).toEqual(expectState);
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
