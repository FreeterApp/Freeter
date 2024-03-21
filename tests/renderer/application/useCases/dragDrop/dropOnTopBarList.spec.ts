/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDropOnTopBarListUseCase } from '@/application/useCases/dragDrop/dropOnTopBarList';
import { AppState } from '@/base/state/app';
import { addWidgetToAppState } from '@/base/state/actions';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetAInColl, fixtureWidgetTypeAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromPalettePaste, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { CloneWidgetToWidgetListSubCase } from '@/application/useCases/shelf/cloneWidgetToWidgetListSubCase';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB } from '@tests/base/fixtures/widget';

const newItemId = 'NEW-ITEM-ID';
const draggingItemId = 'DRAGGING-ITEM-ID';
const draggingTypeId = 'DRAGGING-TYPE-ID';
const draggingItemWidgetId = 'DRAGGING-ITEM-WIDGET-ID';
const targetItemId = 'TARGET-ITEM-ID';
const workflowId = 'WORKFLOW-ID';
const newSettingsState = { widgetProp: 'WIDGET VALUE' }

jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual('@/base/state/actions');
  return {
    ...actual,
    addWidgetToAppState: jest.fn(actual.addWidgetToAppState),
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const cloneWidgetToWidgetListSubCase: jest.MockedFn<CloneWidgetToWidgetListSubCase> = jest.fn();
  const dropOnTopBarListUseCase = createDropOnTopBarListUseCase({
    appStore,
    idGenerator: () => newItemId,
    cloneWidgetToWidgetListSubCase
  });
  return {
    appStore,
    addWidgetToAppState,
    cloneWidgetToWidgetListSubCase,
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
            widgetList: [{ id: newItemId, widgetId: draggingItemWidgetId }, ...initState.ui.shelf.widgetList]
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
            widgetList: [...initState.ui.shelf.widgetList, { id: newItemId, widgetId: draggingItemWidgetId }]
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
            widgetList: [...initState.ui.shelf.widgetList, { id: newItemId, widgetId: draggingItemWidgetId }]
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
    it('should correctly update State, using addWidgetToAppState', async () => {
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
        addWidgetToAppState,
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
            [newItemId]: {
              id: newItemId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newItemId]!.coreSettings,
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [{ id: newItemId, widgetId: newItemId }, ...initState.ui.shelf.widgetList]
          }
        }
      }
      expect(gotState).toEqual(expectState);
      expect(addWidgetToAppState).toBeCalledTimes(1);
    })

  })

  describe('when dragging an item from Palette (Add list) and target item with specified id does not exist', () => {
    it('should correctly update State, using addWidgetToAppState', async () => {
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
        addWidgetToAppState,
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
            [newItemId]: {
              id: newItemId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newItemId]!.coreSettings,
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newItemId, widgetId: newItemId }]
          }
        }
      };
      expect(gotState).toEqual(expectState);
      expect(addWidgetToAppState).toBeCalledTimes(1);
    })
  })

  describe('when dragging an item from Palette (Add list) and target item === null', () => {
    it('should correctly update DragDrop State, using addWidgetToAppState', async () => {
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
        addWidgetToAppState,
        dropOnTopBarListUseCase
      } = await setup(initState)

      await dropOnTopBarListUseCase(null);

      const gotState = appStore.get();
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newItemId]: {
              id: newItemId,
              type: draggingTypeId,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newItemId]!.coreSettings,
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            widgetList: [...initState.ui.shelf.widgetList, { id: newItemId, widgetId: newItemId }]
          }
        }
      };
      expect(gotState).toEqual(expectState);
      expect(addWidgetToAppState).toBeCalledTimes(1);
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
    it('should reset DragDrop State and update Widgets/Shelf state with values returned by cloneWidgetToWidgetListSubCase', async () => {
      const widgetA = fixtureWidgetA();
      const widgetB = fixtureWidgetB();
      const listItemA = fixtureWidgetListItemA({ widgetId: widgetA.id });
      const initState = fixtureAppState({
        entities: {
          widgets: {
            [widgetA.id]: widgetA
          },
        },
        ui: {
          copy: fixtureCopyState({
            widgets: {
              entities: {
                [widgetB.id]: {
                  deps: {},
                  entity: widgetB,
                  id: widgetB.id
                }
              },
              list: [widgetB.id]
            }
          }),
          dragDrop: {
            ...fixtureDragDropFromPalettePaste({
              widgetCopyId: widgetB.id
            })
          },
          shelf: {
            widgetList: [listItemA]
          }
        }
      });
      const {
        appStore,
        dropOnTopBarListUseCase,
        cloneWidgetToWidgetListSubCase
      } = await setup(initState)
      const newWidget = widgetB;
      const newList = [listItemA, fixtureWidgetListItemB({ widgetId: newWidget.id })]
      cloneWidgetToWidgetListSubCase.mockResolvedValueOnce([newWidget, newList])
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

      await dropOnTopBarListUseCase(listItemA.id);

      expect(cloneWidgetToWidgetListSubCase).toBeCalledWith(widgetB, initState.ui.shelf.widgetList, [widgetA.coreSettings.name], listItemA.id);
      expect(appStore.get()).toEqual(expectState);
    })
  })
})
