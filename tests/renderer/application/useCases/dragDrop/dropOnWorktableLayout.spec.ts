/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDropOnWorktableLayoutUseCase } from '@/application/useCases/dragDrop/dropOnWorktableLayout';
import { AppState } from '@/base/state/app';
import { addWidgetToAppState } from '@/base/state/actions';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetAInColl, fixtureWidgetTypeAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureDragDropFromPalette, fixtureDragDropFromTopBarList, fixtureDragDropFromWorktableLayout, fixtureDragDropNotDragging } from '@tests/base/state/fixtures/dragDropState';
import { fixtureWidgetListItemA, fixtureWidgetListItemB } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetLayoutItemA } from '@tests/base/fixtures/widgetLayout';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

const workflowId = 'WORKFLOW-ID';
const newItemId = 'NEW-ITEM-ID';
const draggingItemId = 'SOURCE-ITEM-ID';
const draggingItemWidgetId = 'SOURCE-ITEM-WIDGET-ID';
const draggingItemXY = { x: 1, y: 1 }
const draggingItemWH = { w: 3, h: 4 }

jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual('@/base/state/actions');
  return {
    ...actual,
    addWidgetToAppState: jest.fn(actual.addWidgetToAppState),
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const dropOnWorktableLayoutUseCase = createDropOnWorktableLayoutUseCase({
    appStore,
    idGenerator: () => newItemId
  });
  return {
    appStore,
    addWidgetToAppState,
    dropOnWorktableLayoutUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('dropOnWorktableLayoutUseCase()', () => {
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

      dropOnWorktableLayoutUseCase(workflowId, { x: 1, y: 1 });

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
      dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: [{
                id: newItemId,
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
      dropOnWorktableLayoutUseCase(workflowId, targetXY);

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

  describe('when dragging an item from Palette and the item does not exist', () => {
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
            ...fixtureDragDropFromPalette({
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
      dropOnWorktableLayoutUseCase(workflowId, targetXY);

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

  describe('when dragging an item from Palette and the item exists', () => {
    it('should correctly update state, using addWidgetToAppState', async () => {
      const draggingType = 'DRAGGING-TYPE';
      const existingWidgetId = 'EXISTING-WIDGET';
      const newSettingsState = { widgetProp: 'WIDGET VALUE' }
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
            ...fixtureDragDropFromPalette({
              widgetTypeId: draggingType
            })
          }
        }
      });
      const {
        appStore,
        addWidgetToAppState,
        dropOnWorktableLayoutUseCase
      } = await setup(initState)

      const targetXY = { x: 1, y: 1 };
      dropOnWorktableLayoutUseCase(workflowId, targetXY);

      const gotState = appStore.get();
      const expectState: AppState = {
        ...initState,
        entities: {
          ...initState.entities,
          widgets: {
            ...initState.entities.widgets,
            [newItemId]: {
              id: newItemId,
              type: draggingType,
              settings: newSettingsState,
              coreSettings: gotState.entities.widgets[newItemId]!.coreSettings,
            }
          },
          workflows: {
            ...initState.entities.workflows,
            [workflowId]: {
              ...initState.entities.workflows[workflowId]!,
              layout: [{
                id: newItemId,
                rect: { ...targetXY, w: 2, h: 3 },
                widgetId: newItemId
              }]
            }
          }
        },
        ui: {
          ...initState.ui,
          dragDrop: {}
        }
      }
      expect(gotState).toEqual(expectState);
      expect(addWidgetToAppState).toBeCalledTimes(1);
    })
  })
})
