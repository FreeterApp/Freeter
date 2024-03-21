/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createPasteWidgetToShelfUseCase } from '@/application/useCases/shelf/pasteWidgetToShelf';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { createAddItemToWidgetListSubCase } from '@/application/useCases/shelf/addItemToWidgetListSubCase';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/cloneWidgetSubCase';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';
import { createCloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/cloneWidgetToWidgetListSubCase';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const widgetListItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-WL-ID')
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => 'SOME-W-ID')
  const addItemToWidgetListSubCase = createAddItemToWidgetListSubCase({
    idGenerator: widgetListItemIdGeneratorMock
  })
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const cloneWidgetToWidgetListSubCase = createCloneWidgetToWidgetListSubCase({
    addItemToWidgetListSubCase,
    cloneWidgetSubCase
  })
  const pasteWidgetToShelfUseCase = createPasteWidgetToShelfUseCase({
    appStore,
    cloneWidgetToWidgetListSubCase
  });
  return {
    appStore,
    pasteWidgetToShelfUseCase,
    widgetIdGeneratorMock,
    widgetListItemIdGeneratorMock
  }
}

describe('pasteWidgetToShelfUseCase()', () => {
  it('should do nothing, if no id in copied widgets', async () => {
    const initState = fixtureAppState({
      entities: {
        widgets: {}
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              'A': { id: 'A', deps: [], entity: fixtureWidgetA() }
            },
            list: ['A']
          }
        }),
        shelf: {
          widgetList: []
        }
      }
    })
    const {
      appStore,
      pasteWidgetToShelfUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    await pasteWidgetToShelfUseCase('NO-SUCH-ID', null);

    expect(appStore.get()).toBe(expectState);
  })

  it('should add a clone of the copied widget to entities and Shelf', async () => {
    const widgetA = fixtureWidgetA();
    const widgetB = fixtureWidgetB();
    const widgetBClone: Widget = { ...widgetB, id: widgetB.id + 'CLONE', coreSettings: { ...widgetB.coreSettings, name: widgetB.coreSettings.name + ' Copy 1' } };
    const newWidgetListItem = fixtureWidgetListItemC({ widgetId: widgetBClone.id });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        }
      },
      ui: {
        copy: fixtureCopyState({
          widgets: {
            entities: {
              'A': { id: 'A', deps: [], entity: fixtureWidgetC() },
              'B': { id: 'B', deps: [], entity: widgetB }
            },
            list: ['A', 'B']
          }
        }),
        shelf: {
          widgetList: [
            fixtureWidgetListItemA(),
            fixtureWidgetListItemB(),
          ]
        }
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [widgetBClone.id]: widgetBClone
        }
      },
      ui: {
        ...initState.ui,
        shelf: {
          ...initState.ui.shelf,
          widgetList: [
            initState.ui.shelf.widgetList[0],
            newWidgetListItem,
            initState.ui.shelf.widgetList[1],
          ]
        }
      }
    }
    const {
      appStore,
      pasteWidgetToShelfUseCase,
      widgetIdGeneratorMock,
      widgetListItemIdGeneratorMock,
    } = await setup(initState)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetBClone.id)
    widgetListItemIdGeneratorMock.mockReturnValueOnce(newWidgetListItem.id)

    await pasteWidgetToShelfUseCase('B', initState.ui.shelf.widgetList[1].id);

    expect(appStore.get()).toEqual(expectState);
  })
})
