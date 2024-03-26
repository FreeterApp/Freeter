/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDropOnTopBarListUseCase } from '@/application/useCases/dragDrop/dropOnTopBarList';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetAInColl, fixtureWidgetTypeAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromPalettePaste, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { createCloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/subs/cloneWidgetToWidgetList';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetCoreSettingsA } from '@tests/base/fixtures/widget';
import { createCreateWidgetSubCase } from '@/application/useCases/widget/subs/createWidget';
import { createAddItemToWidgetListSubCase } from '@/application/useCases/shelf/subs/addItemToWidgetList';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { Widget } from '@/base/widget';

const newWidgetId = 'NEW-WIDGET-ID';
const newListItemId = 'NEW-LIST-ITEM-ID';
const draggingItemId = 'DRAGGING-ITEM-ID';
const draggingTypeId = 'DRAGGING-TYPE-ID';
const draggingItemWidgetId = 'DRAGGING-ITEM-WIDGET-ID';
const targetItemId = 'TARGET-ITEM-ID';
const workflowId = 'WORKFLOW-ID';
const newSettingsState = { widgetProp: 'WIDGET VALUE' }

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const listItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newListItemId)
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newWidgetId)
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const addItemToWidgetListSubCase = createAddItemToWidgetListSubCase({
    idGenerator: listItemIdGeneratorMock
  })
  const cloneWidgetToWidgetListSubCase = createCloneWidgetToWidgetListSubCase({
    addItemToWidgetListSubCase,
    cloneWidgetSubCase,
  })
  const createWidgetSubCase = createCreateWidgetSubCase({
    idGenerator: widgetIdGeneratorMock
  })
  const dropOnTopBarListUseCase = createDropOnTopBarListUseCase({
    appStore,
    addItemToWidgetListSubCase,
    createWidgetSubCase,
    cloneWidgetToWidgetListSubCase,
    idGenerator: listItemIdGeneratorMock
  });
  return {
    appStore,
    dropOnTopBarListUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('await dropOnTopBarListUseCase()', () => {
  describe('when not dragging', () => {
    it('should not modify DragDrop state', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl()
          }
        },
        ui: {
          dragDrop: { ...fixtureDragDropNotDragging() },
          shelf: {
            widgetList: [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)
      const expectState = appStore.get();

      await dropOnTopBarListUseCase(null);

      expect(appStore.get()).toBe(expectState);
    })
  })

  describe('when dragging a widget from TopBar list and target item with specified id does not exist', () => {
    it('should reset dragDrop state and leave the rest state not touched', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl()
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromTopBarList()
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase('NO-SUCH-ID-ON-TARGET');

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {},
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging a widget from TopBar list and target item with specified id exist', () => {
    it('should reset dragDrop state, move item on Shelf State\'s list and leave Workflows state not touched', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl()
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromTopBarList({ listItemId: draggingItemId })
          },
          shelf: {
            widgetList: [
              fixtureWidgetListItemA({ id: targetItemId }),
              fixtureWidgetListItemB({ id: draggingItemId }),
              fixtureWidgetListItemC()
            ]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(targetItemId);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [initState.ui.shelf.widgetList[1], initState.ui.shelf.widgetList[0], initState.ui.shelf.widgetList[2]]
          }
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging a widget from TopBar list and target item === null (end of the list)', () => {
    it('should reset dragDrop state, move item on Shelf State\'s list and leave Workflows state untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl()
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromTopBarList({ listItemId: draggingItemId })
          },
          shelf: {
            widgetList: [
              fixtureWidgetListItemA({ id: draggingItemId }),
              fixtureWidgetListItemB(),
              fixtureWidgetListItemC()
            ]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(null);

      const [draggingItem, ...restItems] = initState.ui.shelf.widgetList;
      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...restItems, draggingItem]
          }
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging a widget from Worktable layout and target item with specified id exists', () => {
    it('should reset DragDrop State, remove dragged layout item on Workflows State, create a new item with dragged widget\'s id on Shelf State\'s list, at the position of the target item', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: [fixtureWidgetLayoutItemA({
                id: draggingItemId
              })]
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout({
              workflowId: workflowId,
              widgetId: draggingItemWidgetId,
              layoutItemId: draggingItemId,
              layoutItemWH: { w: 1, h: 1 }
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA({ id: targetItemId })]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(targetItemId);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: []
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [{ id: newListItemId, widgetId: draggingItemWidgetId }, ...initState.ui.shelf.widgetList]
          }
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging a widget from Worktable layout and target item with specified id does not exist', () => {
    it('should reset DragDrop State, remove dragged layout item on Workflows State, create a new item with dragged widget\'s id on Shelf State\'s list, at the end of the list', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: [fixtureWidgetLayoutItemA({
                id: draggingItemId
              })]
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout({
              workflowId,
              widgetId: draggingItemWidgetId,
              layoutItemId: draggingItemId,
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA()]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase('NO-SUCH-ID-ON-TARGET');

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: []
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newListItemId, widgetId: draggingItemWidgetId }]
          }
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging a widget from Worktable layout and target item === null', () => {
    it('should reset DragDrop State, remove dragged layout item on Workflows State, create a new item with dragged widget\'s id on Shelf State\'s list, at the end of the list', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: [fixtureWidgetLayoutItemA({
                id: draggingItemId
              })]
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout({
              workflowId,
              widgetId: draggingItemWidgetId,
              layoutItemId: draggingItemId,
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA()]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(null);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: []
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newListItemId, widgetId: draggingItemWidgetId }]
          }
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging item from Palette (Add list) and the type does not exist', () => {
    it('should reset DragDrop State and leave Widgets/Shelf untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl()
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl()
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: 'NO SUCH TYPE'
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA({ id: targetItemId })]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(targetItemId);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging item from Palette (Add list) and target item exist', () => {
    it('should correctly update State', async () => {
      const existingWidgetId = 'EXISTING-WIDGET';
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({ id: existingWidgetId })
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: draggingTypeId,
              createSettingsState: () => ({ ...newSettingsState })
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: draggingTypeId
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA({ id: targetItemId })]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(targetItemId);

      const gotState = appStore.get();
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newWidgetId]: {
              id: newWidgetId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newWidgetId]!.coreSettings,
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [{ id: newListItemId, widgetId: newWidgetId }, ...initState.ui.shelf.widgetList]
          }
        }
      }
      expect(gotState).toEqual(expectState);
    })

  })

  describe('when dragging an item from Palette (Add list) and target item with specified id does not exist', () => {
    it('should correctly update State', async () => {
      const existingWidgetId = 'EXISTING-WIDGET';
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({ id: existingWidgetId })
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: draggingTypeId,
              createSettingsState: () => ({ ...newSettingsState })
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: draggingTypeId
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA()]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase('NO-SUCH-ID-ON-TARGET');

      const gotState = appStore.get();
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newWidgetId]: {
              id: newWidgetId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newWidgetId]!.coreSettings,
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newListItemId, widgetId: newWidgetId }]
          }
        }
      };
      expect(gotState).toEqual(expectState);
    })
  })

  describe('when dragging an item from Palette (Add list) and target item === null', () => {
    it('should correctly update DragDrop State', async () => {
      const existingWidgetId = 'EXISTING-WIDGET';
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({ id: existingWidgetId })
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: draggingTypeId,
              createSettingsState: () => ({ ...newSettingsState })
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: draggingTypeId
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA()]
          }
        }
      });
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newWidgetId]: {
              id: newWidgetId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: fixtureWidgetCoreSettingsA({
                name: initState.entities.widgetTypes[draggingTypeId]!.name + ' 1'
              })
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newListItemId, widgetId: newWidgetId }]
          }
        }
      };
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(null);

      const gotState = appStore.get();
      expect(gotState).toEqual(expectState);
    })
  })

  describe('when dragging item from Palette (Paste list) and the copy item does not exist', () => {
    it('should reset DragDrop State and keep Widgets/Shelf untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl()
          },
        },
        ui: {
          copy: fixtureCopyState({
            widgets: {
              entities: {
                'W-B': {
                  deps: {},
                  entity: fixtureWidgetB({ id: 'W-B' }),
                  id: 'W-B'
                }
              },
              list: ['W-B']
            }
          }),
          dragDrop: {
            ...fixtureDragDropFromPalettePaste({
              widgetCopyId: 'NO SUCH ITEM'
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA({ id: targetItemId })]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(targetItemId);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      };
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging item from Palette (Paste list) and the copy item exists', () => {
    it('should reset DragDrop State and correctly update Widgets/Shelf state', async () => {
      const copiedWidget = fixtureWidgetA({ coreSettings: fixtureWidgetCoreSettingsA({ name: 'Some Widget' }) })
      const widgetOnList = fixtureWidgetB({ coreSettings: fixtureWidgetCoreSettingsA({ name: 'Some Widget Copy 1' }) });
      const newWidget: Widget = { ...copiedWidget, id: newWidgetId, coreSettings: fixtureWidgetCoreSettingsA({ name: copiedWidget.coreSettings.name + ' Copy 2' }) };
      const listItemA = fixtureWidgetListItemA({ widgetId: widgetOnList.id });
      const newList = [fixtureWidgetListItemB({ id: newListItemId, widgetId: newWidget.id }), listItemA]
      const initState = fixtureAppState({
        entities: {
          widgets: {
            [widgetOnList.id]: widgetOnList
          },
        },
        ui: {
          copy: fixtureCopyState({
            widgets: {
              entities: {
                [copiedWidget.id]: {
                  deps: {},
                  entity: copiedWidget,
                  id: copiedWidget.id
                }
              },
              list: [copiedWidget.id]
            }
          }),
          dragDrop: {
            ...fixtureDragDropFromPalettePaste({
              widgetCopyId: copiedWidget.id
            })
          },
          shelf: {
            widgetList: [listItemA]
          }
        }
      });
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newWidget.id]: newWidget
          },
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            ...initState.ui.shelf,
            widgetList: newList
          }
        }
      };
      const {
        appStore,
        dropOnTopBarListUseCase,
      } = await setup(initState)

      await dropOnTopBarListUseCase(listItemA.id);

      expect(appStore.get()).toEqual(expectState);
    })
  })
})
