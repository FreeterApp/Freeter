/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDropOnWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dropOnWorktableLayout';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetAInColl, fixtureWidgetTypeAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropFromPaletteAdd, fixtureDragDropFromPalettePaste, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetListItemA, fixtureWidgetListItemB } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { createCloneWidgetToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/cloneWidgetToWidgetLayout';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetCoreSettingsA, fixtureWidgetCoreSettingsB } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA } from '@tests/base/fixtures/workflow';
import { fixtureWidgetTypeA } from '@tests/base/fixtures/widgetType';
import { createAddItemToWidgetLayoutSubCase } from '@/application/useCases/workflow/subs/addItemToWidgetLayout';
import { createCreateWidgetSubCase } from '@/application/useCases/widget/subs/createWidget';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { Widget } from '@/base/widget';

const workflowId = 'WORKFLOW-ID';
const newLayoutItemId = 'NEW-LAYOUT-ITEM-ID';
const newWidgetId = 'NEW-WIDGET-ID';
const draggingItemId = 'SOURCE-ITEM-ID';
const draggingItemWidgetId = 'SOURCE-ITEM-WIDGET-ID';
const draggingItemXY = { x: 1, y: 1 }
const draggingItemWH = { w: 3, h: 4 }

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const layoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newLayoutItemId);
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newWidgetId);
  const createWidgetSubCase = createCreateWidgetSubCase({
    idGenerator: widgetIdGeneratorMock
  })
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const addItemToWidgetLayoutSubCase = createAddItemToWidgetLayoutSubCase({
    idGenerator: layoutItemIdGeneratorMock
  })
  const cloneWidgetToWidgetLayoutSubCase = createCloneWidgetToWidgetLayoutSubCase({
    addItemToWidgetLayoutSubCase,
    cloneWidgetSubCase
  })
  const dropOnWorktableLayoutUseCase = createDropOnWorktableLayoutUseCase({
    appStore,
    idGenerator: layoutItemIdGeneratorMock,
    cloneWidgetToWidgetLayoutSubCase,
    addItemToWidgetLayoutSubCase,
    createWidgetSubCase
  });
  return {
    appStore,
    dropOnWorktableLayoutUseCase,
    layoutItemIdGeneratorMock,
    widgetIdGeneratorMock,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('await dropOnWorktableLayoutUseCase()', () => {
  describe('when not dragging an item', () => {
    it('should not modify State', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({ id: workflowId })
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
        dropOnWorktableLayoutUseCase
      } = await setup(initState)
      const expectState = appStore.get();

      await dropOnWorktableLayoutUseCase(workflowId, { x: 1, y: 1 });

      expect(appStore.get()).toBe(expectState);
    })
  })

  describe('when dragging an item from TopBar list', () => {
    it('should reset dragDrop state, remove dragged item from TopBar list and create a new item with dragged widget\'s id, width/height = widget type\'s min width/height on Worktable layout at target x,y', async () => {
      const wgtTypeId = 'WIDGET-TYPE-ID';
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({ id: draggingItemWidgetId, type: wgtTypeId })
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({ id: wgtTypeId, minSize: { w: 2, h: 3 } })
          },
          workflows: {
            ...fixtureWorkflowAInColl({ id: workflowId, layout: [] })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromTopBarList({
              widgetId: draggingItemWidgetId,
              listItemId: draggingItemId
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA({ id: draggingItemId }), fixtureWidgetListItemB()]
          }
        }
      });
      const {
        appStore,
        dropOnWorktableLayoutUseCase
      } = await setup(initState)

      const targetXY = { x: 1, y: 1 };
      await dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: [{
                id: newLayoutItemId,
                rect: { ...targetXY, w: 2, h: 3 },
                widgetId: draggingItemWidgetId
              }]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
          shelf: {
            ...initState.ui.shelf,
            widgetList: [initState.ui.shelf.widgetList[1]]
          }
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Worktable layout', () => {
    it('should reset dragDrop state, move item on Workable Layout to the target x,y and leave Shelf state untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: [fixtureWidgetLayoutItemA({
                id: draggingItemId,
                rect: {
                  ...draggingItemXY,
                  ...draggingItemWH
                }
              })]
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromWorktableLayout({
              workflowId,
              layoutItemId: draggingItemId
            })
          },
          shelf: {
            widgetList: [fixtureWidgetListItemA(), fixtureWidgetListItemB()]
          }
        }
      });
      const {
        appStore,
        dropOnWorktableLayoutUseCase
      } = await setup(initState)

      const targetXY = { x: 2, y: 3 }
      await dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: [{
                ...initState.entities.workflows[workflowId]!.layout[0],
                rect: {
                  ...initState.entities.workflows[workflowId]!.layout[0].rect,
                  ...targetXY
                }
              }]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {},
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Palette (Add list) and the item does not exist', () => {
    it('should reset DragDrop state and leave Widgets/workflows State untouched', async () => {
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl()
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl()
          },
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: []
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: 'NO SUCH TYPE'
            })
          }
        }
      });
      const {
        appStore,
        dropOnWorktableLayoutUseCase
      } = await setup(initState)

      const targetXY = { x: 1, y: 1 };
      await dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Palette (Add list) and the item exists', () => {
    it('should correctly update state', async () => {
      const draggingType = 'DRAGGING-TYPE';
      const existingWidgetId = 'EXISTING-WIDGET';
      const newSettingsState = { widgetProp: 'WIDGET VALUE' }
      const targetXY = { x: 1, y: 1 };
      const initState = fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({ id: existingWidgetId })
          },
          widgetTypes: {
            ...fixtureWidgetTypeAInColl({
              id: draggingType,
              minSize: {
                w: 2,
                h: 3
              },
              createSettingsState: () => ({ ...newSettingsState })
            })
          },
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
              layout: []
            })
          }
        },
        ui: {
          dragDrop: {
            ...fixtureDragDropFromPaletteAdd({
              widgetTypeId: draggingType
            })
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
              type: draggingType,
              settings: newSettingsState,
              coreSettings: expect.objectContaining({
                name: initState.entities.widgetTypes[draggingType]!.name + ' 1'
              })
            }
          },
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: [{
                id: newLayoutItemId,
                rect: { ...targetXY, w: 2, h: 3 },
                widgetId: newWidgetId
              }]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      const {
        appStore,
        dropOnWorktableLayoutUseCase
      } = await setup(initState)

      await dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const gotState = appStore.get();
      expect(gotState).toEqual(expectState);
    })
  })

  describe('when dragging an item from Palette (Paste list) and the copy item does not exist', () => {
    it('should reset DragDrop state and keep Widgets/workflows State untouched', async () => {
      const widgetTypeA = fixtureWidgetTypeA();
      const widgetA = fixtureWidgetA();
      const widgetB = fixtureWidgetB({ type: widgetTypeA.id });
      const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id, rect: { x: 5, y: 5, w: 1, h: 1 } })] });
      const initState = fixtureAppState({
        entities: {
          widgets: {
            [widgetA.id]: widgetA
          },
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
              widgetCopyId: 'NO-SUCH-ID'
            })
          }
        }
      });
      const {
        appStore,
        dropOnWorktableLayoutUseCase,
      } = await setup(initState)

      const targetXY = { x: 1, y: 1 };
      await dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const expectState: AppState = {
        ...initState,
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }

      expect(appStore.get()).toEqual(expectState);
    })
  })

  describe('when dragging an item from Palette (Paste list) and the copy item exists', () => {
    it('should reset DragDrop State and correctly update Widgets/Shelf state', async () => {
      const widgetTypeA = fixtureWidgetTypeA();
      const copiedWidget = fixtureWidgetA({ type: widgetTypeA.id, coreSettings: fixtureWidgetCoreSettingsA({ name: 'Some Widget' }) });
      const widgetOnLayout = fixtureWidgetB({ coreSettings: fixtureWidgetCoreSettingsB({ name: 'Some Widget Copy 1' }) });
      const newWidget: Widget = ({ ...copiedWidget, id: newWidgetId, coreSettings: { ...copiedWidget.coreSettings, name: 'Some Widget Copy 2' } });
      const workflowA = fixtureWorkflowA({
        layout: [
          fixtureWidgetLayoutItemA({ widgetId: widgetOnLayout.id, rect: { x: 5, y: 5, w: 1, h: 1 } })
        ]
      });
      const targetXY = { x: 1, y: 1 };
      const newLayout = [
        ...workflowA.layout,
        fixtureWidgetLayoutItemB({ id: newLayoutItemId, widgetId: newWidget.id, rect: { ...targetXY, w: widgetTypeA.minSize.w, h: widgetTypeA.minSize.h } })
      ]
      const initState = fixtureAppState({
        entities: {
          widgets: {
            [widgetOnLayout.id]: widgetOnLayout
          },
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
          }
        }
      });
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newWidget.id]: newWidget,
          },
          workflows: {
            ...initState.entities.workflows,
            [workflowA.id]: {
              ...initState.entities.workflows[workflowA.id]!,
              layout: newLayout
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      const {
        appStore,
        dropOnWorktableLayoutUseCase,
      } = await setup(initState)

      await dropOnWorktableLayoutUseCase(workflowA.id, targetXY);

      expect(appStore.get()).toEqual(expectState);
    })
  })
})
