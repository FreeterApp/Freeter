/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorkflowAInColl, fixtureWorkflowBInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWidgetDInColl, fixtureWidgetEInColl } from '@tests/base/state/fixtures/entitiesState';
import { addWidgetToAppState, deleteWidgetsFromAppState } from '@/base/state/actions';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureWidgetListItemA, fixtureWidgetListItemB, fixtureWidgetListItemC } from '@tests/base/fixtures/widgetList';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC, fixtureWidgetCoreSettingsA, fixtureWidgetCoreSettingsB, fixtureWidgetCoreSettingsC, fixtureWidgetCoreSettingsD, fixtureWidgetD, fixtureWidgetEnvAreaShelf, fixtureWidgetEnvAreaWorkflow } from '@tests/base/fixtures/widget';
import { fixtureShelf } from '@tests/base/state/fixtures/shelf';
import { fixtureWidgetTypeA, fixtureWidgetTypeB } from '@tests/base/fixtures/widgetType';

const workflowId1 = 'WORKFLOW-ID1';
const workflowId2 = 'WORKFLOW-ID2';
const widgetId1 = 'WIDGET-ID1';
const widgetId2 = 'WIDGET-ID2';
const widgetId3 = 'WIDGET-ID3';
const widgetId4 = 'WIDGET-ID4';
const widgetId5 = 'WIDGET-ID5';

describe('addWidgetToAppState()', () => {
  it('should do nothing, if the specified widget type does not exist', () => {
    const newWidgetId = 'NEW-WIDGET-ID';
    const newWidgetListItemId = 'NEW-WIDGET-LIST-ITEM-ID';
    const targetWidgetListItemId = 'TARGET-WIDGET-LIST-ITEM-ID'
    const widgetA = fixtureWidgetA();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [fixtureWidgetListItemA({ widgetId: widgetA.id })]
        })
      }
    })

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      {
        type: 'shelf',
        newListItemId: newWidgetListItemId,
        targetListItemId: targetWidgetListItemId
      },
      'NO-SUCH-ID',
      newWidgetId
    );

    expect(gotState).toBe(initState);
    expect(gotItem).toBeNull();
  })

  it('should add a widget to the shelf, when addTo = shelf', () => {
    const newWidgetId = 'NEW-WIDGET-ID';
    const newWidgetListItemId = 'NEW-WIDGET-LIST-ITEM-ID';
    const targetWidgetListItemId = 'TARGET-WIDGET-LIST-ITEM-ID'
    const widgetA = fixtureWidgetA();
    const widgetTypeA = fixtureWidgetTypeA();
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        }
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [fixtureWidgetListItemA({ id: targetWidgetListItemId, widgetId: widgetA.id })]
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({ id: newWidgetId })
        }
      },
      ui: {
        ...initState.ui,
        shelf: {
          ...initState.ui.shelf,
          widgetList: [
            expect.objectContaining({
              id: newWidgetListItemId,
              widgetId: newWidgetId
            }),
            ...initState.ui.shelf.widgetList
          ]
        }
      }
    };

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      {
        type: 'shelf',
        newListItemId: newWidgetListItemId,
        targetListItemId: targetWidgetListItemId
      },
      widgetTypeA.id,
      newWidgetId
    );

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.widgets[newWidgetId]);
  })

  it('should name the widget based on the widget type and used names in the target workflow, when addTo = shelf', () => {
    const widgetTypeName = 'WIDGET TYPE'
    const widgetTypeA = fixtureWidgetTypeA({ name: widgetTypeName });
    const widgetTypeB = fixtureWidgetTypeB({ name: 'OTHER TYPE' });
    const widgetA = fixtureWidgetA({ coreSettings: fixtureWidgetCoreSettingsA({ name: `${widgetTypeName} 1` }) })
    const widgetB = fixtureWidgetB({ coreSettings: fixtureWidgetCoreSettingsB({ name: 'OTHER TYPE 1' }) })
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA,
          [widgetTypeB.id]: widgetTypeB,
        },
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
        },
      },
      ui: {
        shelf: fixtureShelf({
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetA.id }),
            fixtureWidgetListItemB({ widgetId: widgetB.id }),
          ]
        })
      }
    })

    const [, gotItem] = addWidgetToAppState(
      initState,
      {
        type: 'shelf',
        newListItemId: 'NEW-LIST-ITEM-ID',
        targetListItemId: null
      },
      widgetTypeA.id,
      'NEW-WIDGET-ID'
    );

    expect(gotItem?.coreSettings.name).toBe(`${widgetTypeName} 2`);
  })

  it('should add a widget to a specified XY of a workflow with a specified widget size, when addTo = workflow and both XY and the widget size are specified', () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const newWidgetId = 'NEW-WIDGET-ID';
    const newLayoutItemId = 'NEW-WIDGET-LAYOUT-ITEM-ID';
    const xy = { x: 2, y: 0 };
    const wh = { w: 2, h: 3 };
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        widgets: {
          ...fixtureWidgetAInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 3, y: 1, w: 3, h: 2 } }),
              fixtureWidgetLayoutItemB({ rect: { x: 0, y: 0, w: 2, h: 3 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 2, y: 4, w: 4, h: 14 } }),
              fixtureWidgetLayoutItemD({ rect: { x: 3, y: 0, w: 3, h: 1 } })
            ]
          }),
          ...fixtureWorkflowBInColl(),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({ id: newWidgetId })
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [
              { ...initState.entities.workflows[workflowId1]!.layout[0], rect: { x: 3, y: 4, w: 3, h: 2 } },
              { ...initState.entities.workflows[workflowId1]!.layout[1], rect: { x: 0, y: 0, w: 2, h: 3 } },
              { ...initState.entities.workflows[workflowId1]!.layout[2], rect: { x: 2, y: 6, w: 4, h: 14 } },
              { ...initState.entities.workflows[workflowId1]!.layout[3], rect: { x: 3, y: 3, w: 3, h: 1 } },
              expect.objectContaining({ id: newLayoutItemId, widgetId: newWidgetId, rect: { ...xy, ...wh } })
            ]
          }
        }
      }
    };

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      { type: 'workflow', newLayoutItemId, workflowId: workflowId1, newLayoutItemXY: xy, newLayoutItemWH: wh },
      widgetTypeA.id,
      newWidgetId
    );

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.widgets[newWidgetId]);
  })

  it('should add a widget to the closest free area of a workflow with a specified widget size, when addTo = workflow and XY is not specified', () => {
    const widgetTypeA = fixtureWidgetTypeA({ minSize: { w: 2, h: 2 } });
    const newWidgetId = 'NEW-WIDGET-ID';
    const newLayoutItemId = 'NEW-WIDGET-LAYOUT-ITEM-ID';
    const wh = { w: 3, h: 3 };
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        widgets: {
          ...fixtureWidgetAInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 2, y: 2, w: 2, h: 2 } }),
              fixtureWidgetLayoutItemB({ rect: { x: 6, y: 0, w: 10, h: 3 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 7, y: 4, w: 9, h: 2 } })
            ]
          }),
          ...fixtureWorkflowBInColl(),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({ id: newWidgetId })
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [
              ...initState.entities.workflows[workflowId1]!.layout,
              expect.objectContaining({ id: newLayoutItemId, widgetId: newWidgetId, rect: { x: 4, y: 3, ...wh } })
            ]
          }
        }
      }
    };

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      { type: 'workflow', newLayoutItemId, workflowId: workflowId1, newLayoutItemWH: wh },
      widgetTypeA.id,
      newWidgetId
    );

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.widgets[newWidgetId]);
  })

  it('should add a widget to a specified XY of a workflow with the widget size = widget type min size, when addTo = workflow and the widget size is not specified', () => {
    const newWidgetId = 'NEW-WIDGET-ID';
    const newLayoutItemId = 'NEW-WIDGET-LAYOUT-ITEM-ID';
    const xy = { x: 2, y: 0 };
    const minSize = { w: 3, h: 3 };
    const widgetTypeA = fixtureWidgetTypeA({ minSize });
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        widgets: {
          ...fixtureWidgetAInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 3, y: 1, w: 3, h: 2 } }),
              fixtureWidgetLayoutItemB({ rect: { x: 0, y: 0, w: 2, h: 3 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 2, y: 4, w: 4, h: 14 } }),
              fixtureWidgetLayoutItemD({ rect: { x: 3, y: 0, w: 3, h: 1 } })
            ]
          }),
          ...fixtureWorkflowBInColl(),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({ id: newWidgetId })
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [
              { ...initState.entities.workflows[workflowId1]!.layout[0], rect: { x: 3, y: 4, w: 3, h: 2 } },
              { ...initState.entities.workflows[workflowId1]!.layout[1], rect: { x: 0, y: 0, w: 2, h: 3 } },
              { ...initState.entities.workflows[workflowId1]!.layout[2], rect: { x: 2, y: 6, w: 4, h: 14 } },
              { ...initState.entities.workflows[workflowId1]!.layout[3], rect: { x: 3, y: 3, w: 3, h: 1 } },
              expect.objectContaining({ id: newLayoutItemId, widgetId: newWidgetId, rect: { ...xy, ...minSize } })
            ]
          }
        }
      }
    };

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      { type: 'workflow', newLayoutItemId, workflowId: workflowId1, newLayoutItemXY: xy },
      widgetTypeA.id,
      newWidgetId
    );

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.widgets[newWidgetId]);
  })

  it('should add a widget to the closest free area of a workflow with the widget size = widget type min size, when addTo = workflow and both XY and the widget size are not specified', () => {
    const minSize = { w: 3, h: 4 };
    const widgetTypeA = fixtureWidgetTypeA({ minSize });
    const newWidgetId = 'NEW-WIDGET-ID';
    const newLayoutItemId = 'NEW-WIDGET-LAYOUT-ITEM-ID';
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        widgets: {
          ...fixtureWidgetAInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 2, y: 2, w: 2, h: 2 } }),
              fixtureWidgetLayoutItemB({ rect: { x: 6, y: 0, w: 10, h: 3 } }),
              fixtureWidgetLayoutItemC({ rect: { x: 7, y: 4, w: 9, h: 2 } })
            ]
          }),
          ...fixtureWorkflowBInColl(),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          ...initState.entities.widgets,
          [newWidgetId]: expect.objectContaining({ id: newWidgetId })
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [
              ...initState.entities.workflows[workflowId1]!.layout,
              expect.objectContaining({ id: newLayoutItemId, widgetId: newWidgetId, rect: { x: 4, y: 3, ...minSize } })
            ]
          }
        }
      }
    };

    const [gotState, gotItem] = addWidgetToAppState(
      initState,
      { type: 'workflow', newLayoutItemId, workflowId: workflowId1 },
      widgetTypeA.id,
      newWidgetId
    );

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.widgets[newWidgetId]);
  })

  it('should name the widget based on the widget type and used names in the target workflow, when addTo=workflow', () => {
    const widgetTypeName = 'WIDGET TYPE'
    const widgetTypeA = fixtureWidgetTypeA({ name: widgetTypeName });
    const widgetTypeB = fixtureWidgetTypeB({ name: 'OTHER TYPE' });
    const widgetA = fixtureWidgetA({ coreSettings: fixtureWidgetCoreSettingsA({ name: `${widgetTypeName} 1` }) })
    const widgetB = fixtureWidgetB({ coreSettings: fixtureWidgetCoreSettingsB({ name: 'OTHER TYPE 1' }) })
    const widgetC = fixtureWidgetC({ coreSettings: fixtureWidgetCoreSettingsC({ name: `${widgetTypeName} 2` }) })
    const widgetD = fixtureWidgetD({ coreSettings: fixtureWidgetCoreSettingsD({ name: `${widgetTypeName} 3` }) })
    const initState = fixtureAppState({
      entities: {
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA,
          [widgetTypeB.id]: widgetTypeB,
        },
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
          [widgetC.id]: widgetC,
          [widgetD.id]: widgetD,
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ rect: { x: 2, y: 2, w: 2, h: 2 }, widgetId: widgetA.id }),
              fixtureWidgetLayoutItemB({ rect: { x: 6, y: 0, w: 2, h: 3 }, widgetId: widgetB.id }),
              fixtureWidgetLayoutItemC({ rect: { x: 7, y: 4, w: 1, h: 2 }, widgetId: widgetC.id })
            ]
          }),
          ...fixtureWorkflowBInColl({
            layout: [
              fixtureWidgetLayoutItemD({ widgetId: widgetD.id })
            ]
          }),
        }
      },
    })

    const [, gotItem] = addWidgetToAppState(
      initState,
      { type: 'workflow', newLayoutItemId: 'NEW-LAYOUT-ITEM-ID', workflowId: workflowId1 },
      widgetTypeA.id,
      'NEW-WIDGET-ID'
    );

    expect(gotItem?.coreSettings.name).toBe(`${widgetTypeName} 3`);
  })
});

describe('deleteWidgetsFromAppState()', () => {
  it('should do nothing, if the specified owner-workflow does not exist', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 })
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId3 }),
            fixtureWidgetListItemB({ widgetId: widgetId4 }),
          ]
        }
      }
    })
    const expectState = initState;

    const gotState = deleteWidgetsFromAppState(initState, fixtureWidgetEnvAreaWorkflow({ workflowId: 'NO-SUCH-ID' }), [widgetId1, widgetId2]);

    expect(gotState).toBe(expectState);
  })

  it('should do nothing, if the specified widgets do not exist on workflows', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 })
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId3 }),
            fixtureWidgetListItemB({ widgetId: widgetId4 }),
          ]
        }
      }
    })
    const expectState = initState;

    const gotState = deleteWidgetsFromAppState(initState, fixtureWidgetEnvAreaWorkflow({ workflowId: workflowId1 }), [widgetId3, widgetId4]);

    expect(gotState).toBe(expectState);
  })

  it('should do nothing, if the specified widgets do not exist on the specified workflow', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 })
            ]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2, layout: [
              fixtureWidgetLayoutItemC({ widgetId: widgetId5 }),
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
          ...fixtureWidgetEInColl({ id: widgetId5 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId3 }),
            fixtureWidgetListItemB({ widgetId: widgetId4 }),
          ]
        }
      }
    })
    const expectState = initState;

    const gotState = deleteWidgetsFromAppState(initState, fixtureWidgetEnvAreaWorkflow({ workflowId: workflowId1 }), [widgetId5]);

    expect(gotState).toBe(expectState);
  })

  it('should do nothing, if the specified widgets do not exist on the shelf', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 })
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId3 }),
            fixtureWidgetListItemB({ widgetId: widgetId4 }),
          ]
        }
      }
    })
    const expectState = initState;

    const gotState = deleteWidgetsFromAppState(initState, fixtureWidgetEnvAreaShelf(), [widgetId1, widgetId2]);

    expect(gotState).toBe(expectState);
  })

  it('should delete the ids from the owner workflows\'s list of widget ids, and delete the widget entities, excluding the ids that don\'t exist on the owner workflow\'s list', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 }),
              fixtureWidgetLayoutItemD({ widgetId: widgetId4 }),
            ]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2, layout: [
              fixtureWidgetLayoutItemC({ widgetId: widgetId3 }),
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
          ...fixtureWidgetEInColl({ id: widgetId5 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId5 }),
          ]
        }
      }
    })

    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        workflows: {
          ...initState.entities.workflows,
          [workflowId1]: {
            ...initState.entities.workflows[workflowId1]!,
            layout: [initState.entities.workflows[workflowId1]!.layout[1]]
          },
        },
        widgets: {
          [widgetId2]: initState.entities.widgets[widgetId2]!,
          [widgetId3]: initState.entities.widgets[widgetId3]!,
          [widgetId5]: initState.entities.widgets[widgetId5]!,
        }
      }
    };

    const gotState = deleteWidgetsFromAppState(
      initState,
      fixtureWidgetEnvAreaWorkflow({ workflowId: workflowId1 }),
      [widgetId1, widgetId3, widgetId4, widgetId5]
    );

    expect(gotState).toEqual(expectState);
  })

  it('should delete the ids from the owner shelf\'s list of widget ids, and delete the widget entities, excluding the ids that don\'t exist on the owner shelf\'s list', () => {
    const initState = fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
            ]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        }
      },
      ui: {
        shelf: {
          widgetList: [
            fixtureWidgetListItemA({ widgetId: widgetId2 }),
            fixtureWidgetListItemB({ widgetId: widgetId3 }),
            fixtureWidgetListItemC({ widgetId: widgetId4 }),
          ]
        }
      }
    })

    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        widgets: {
          [widgetId1]: initState.entities.widgets[widgetId1]!,
          [widgetId2]: initState.entities.widgets[widgetId2]!,
        }
      },
      ui: {
        ...initState.ui,
        shelf: {
          ...initState.ui.shelf,
          widgetList: [initState.ui.shelf.widgetList[0]]
        }
      }
    };

    const gotState = deleteWidgetsFromAppState(initState, fixtureWidgetEnvAreaShelf(), [widgetId1, widgetId3, widgetId4]);

    expect(gotState).toEqual(expectState);
  })

})
