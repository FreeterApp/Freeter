/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureProjectBInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl, fixtureWorkflowCInColl, fixtureWorkflowDInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWidgetDInColl } from '@tests/base/state/fixtures/entitiesState';
import { CopyEntityResult, addWorkflowToAppState, copyWorkflowsInAppState, deleteWorkflowsFromAppState } from '@/base/state/actions';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureWorkflowSettingsA, fixtureWorkflowSettingsB, fixtureWorkflowSettingsC } from '@tests/base/fixtures/workflow';

const projectId1 = 'PROJECT-ID1';
const projectId2 = 'PROJECT-ID2';
const workflowId1 = 'WORKFLOW-ID1';
const workflowId2 = 'WORKFLOW-ID2';
const workflowId3 = 'WORKFLOW-ID3';
const workflowId4 = 'WORKFLOW-ID4';
const widgetId1 = 'WIDGET-ID1';
const widgetId2 = 'WIDGET-ID2';
const widgetId3 = 'WIDGET-ID3';
const widgetId4 = 'WIDGET-ID4';

describe('addWorkflowToAppState()', () => {
  it('should not update the state and return null item, if the specified owner-project do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId1 })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
    })
    const expectState = initState;

    const [gotState, gotItem] = addWorkflowToAppState(initState, 'NO-SUCH-ID', 'NEW-ID');

    expect(gotState).toBe(expectState);
    expect(gotItem).toBeNull();
  })

  it('should correctly update the state and return the new item, when posByWorkflowId is not specified', () => {
    const newWorkflowId = 'NEW-WORKFLOW-ID';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId1 }),
          ...fixtureProjectBInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1, settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }) }),
          ...fixtureWorkflowBInColl({ id: workflowId2, settings: fixtureWorkflowSettingsA({ name: 'Workflow 2' }) }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [...initState.entities.projects[projectId1]!.workflowIds, newWorkflowId],
            currentWorkflowId: newWorkflowId
          }
        },
        workflows: {
          ...initState.entities.workflows,
          [newWorkflowId]: expect.objectContaining({ id: newWorkflowId, settings: { name: 'Workflow 3' } })
        }
      }
    };

    const [gotState, gotItem] = addWorkflowToAppState(initState, projectId1, newWorkflowId);

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.workflows[newWorkflowId]);
  })

  it('should correctly update the state and return the new item, when posByWorkflowId is specified', () => {
    const newWorkflowId = 'NEW-WORKFLOW-ID';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId1 }),
          ...fixtureProjectBInColl()
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1, settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }) }),
          ...fixtureWorkflowBInColl({ id: workflowId2, settings: fixtureWorkflowSettingsA({ name: 'Workflow 2' }) }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1, newWorkflowId, workflowId2],
            currentWorkflowId: newWorkflowId
          }
        },
        workflows: {
          ...initState.entities.workflows,
          [newWorkflowId]: expect.objectContaining({ id: newWorkflowId, settings: { name: 'Workflow 3' } })
        }
      }
    };

    const [gotState, gotItem] = addWorkflowToAppState(initState, projectId1, newWorkflowId, workflowId2);

    expect(gotState).toStrictEqual(expectState);
    expect(gotItem).toBe(gotState.entities.workflows[newWorkflowId]);
  })
})

describe('deleteWorkflowsFromAppState()', () => {
  it('should do nothing, if the specified owner-project do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId1 })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
    })
    const expectState = initState;

    const gotState = deleteWorkflowsFromAppState(initState, 'NO-SUCH-ID', [workflowId1, workflowId2]);

    expect(gotState).toBe(expectState);
  })

  it('should do nothing, if the specified workflows do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId1 })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
    })
    const expectState = initState;

    const gotState = deleteWorkflowsFromAppState(initState, projectId1, ['NO-SUCH-ID', 'NO-SUCH-ID-AGAIN']);

    expect(gotState).toBe(expectState);
  })


  it('should delete the ids from the owner project\'s list of workflows, and delete the workflow entities, excluding the ids that don\'t exist on the owner project\'s list', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId3] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId2]
          },
        },
        workflows: {
          [workflowId2]: initState.entities.workflows[workflowId2]!,
          [workflowId3]: initState.entities.workflows[workflowId3]!,
        }
      }
    };

    const gotState = deleteWorkflowsFromAppState(initState, projectId1, [workflowId1, workflowId3]);

    expect(gotState).toEqual(expectState);
  })

  it('should correctly update the current workflow id of the owner project, when it is at the beginning of the list and deleted', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3, workflowId4], currentWorkflowId: workflowId1 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
          ...fixtureWorkflowDInColl({ id: workflowId4 }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId3, workflowId4],
            currentWorkflowId: workflowId3
          },
        },
        workflows: {
          [workflowId3]: initState.entities.workflows[workflowId3]!,
          [workflowId4]: initState.entities.workflows[workflowId4]!,
        }
      }
    };

    expect(deleteWorkflowsFromAppState(initState, projectId1, [workflowId1, workflowId2])).toEqual(expectState);
  })
  it('should correctly update the current workflow id of the owner project, when it is in the middle of the list and deleted', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3, workflowId4], currentWorkflowId: workflowId3 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
          ...fixtureWorkflowDInColl({ id: workflowId4 }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1, workflowId4],
            currentWorkflowId: workflowId4
          },
        },
        workflows: {
          [workflowId1]: initState.entities.workflows[workflowId1]!,
          [workflowId4]: initState.entities.workflows[workflowId4]!,
        }
      }
    };

    expect(deleteWorkflowsFromAppState(initState, projectId1, [workflowId2, workflowId3])).toEqual(expectState);
  })

  it('should correctly update the current workflow id of the owner project, when it is at the end of the list and deleted', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3, workflowId4], currentWorkflowId: workflowId4 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
          ...fixtureWorkflowDInColl({ id: workflowId4 }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1, workflowId2],
            currentWorkflowId: workflowId2
          },
        },
        workflows: {
          [workflowId1]: initState.entities.workflows[workflowId1]!,
          [workflowId2]: initState.entities.workflows[workflowId2]!,
        }
      }
    };

    expect(deleteWorkflowsFromAppState(initState, projectId1, [workflowId3, workflowId4])).toEqual(expectState);
  })

  it('should correctly update the current workflow id of the owner project, when all items deleted', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3, workflowId4], currentWorkflowId: workflowId3 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
          ...fixtureWorkflowDInColl({ id: workflowId4 }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [],
            currentWorkflowId: ''
          },
        },
        workflows: {
        }
      }
    };

    expect(deleteWorkflowsFromAppState(initState, projectId1, [workflowId1, workflowId2, workflowId3, workflowId4])).toEqual(expectState);
  })

  it('should delete all widget entities using widget ids from all the deleted workflows\' widget layouts', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId4] })
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 })
            ]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2, layout: [
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 }),
              fixtureWidgetLayoutItemC({ widgetId: widgetId3 })
            ]
          }),
          ...fixtureWorkflowCInColl({ id: workflowId3 }),
          ...fixtureWorkflowDInColl({
            id: workflowId4, layout: [
              fixtureWidgetLayoutItemD({ widgetId: widgetId4 })
            ]
          }),
        }
      },
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1]
          },
        },
        widgets: {
          [widgetId1]: initState.entities.widgets[widgetId1]!,
          [widgetId4]: initState.entities.widgets[widgetId4]!,
        },
        workflows: {
          [workflowId1]: initState.entities.workflows[workflowId1]!,
          [workflowId4]: initState.entities.workflows[workflowId4]!,
        }
      }
    };

    const gotState = deleteWorkflowsFromAppState(initState, projectId1, [workflowId2, workflowId3, workflowId4]);

    expect(gotState).toEqual(expectState);
  })
})

describe('copyWorkflowsInAppState()', () => {
  it('should do nothing, if the "to" project does not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1,
            layout: [fixtureWidgetLayoutItemA({ widgetId: widgetId1 })]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2,
            layout: [fixtureWidgetLayoutItemB({ widgetId: widgetId2 })]
          }),
        }
      },
    })
    const expectState = initState;

    const { newState, newWidgetIds, newWorkflowIds } = copyWorkflowsInAppState(initState, [workflowId1, workflowId2], 'NO-SUCH-ID', null, () => '', true);

    expect(newState).toBe(expectState);
    expect(newWidgetIds).toEqual([]);
    expect(newWorkflowIds).toEqual([]);
  })

  it('should do nothing, if the workflow ids do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1,
            layout: [fixtureWidgetLayoutItemA({ widgetId: widgetId1 })]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2,
            layout: [fixtureWidgetLayoutItemB({ widgetId: widgetId2 })]
          }),
        }
      },
    })
    const expectState = initState;

    const { newState, newWidgetIds, newWorkflowIds } = copyWorkflowsInAppState(initState, ['NO-SUCH-ID', 'NO-SUCH-ID2'], projectId2, null, () => '', true);

    expect(newState).toBe(expectState);
    expect(newWidgetIds).toEqual([]);
    expect(newWorkflowIds).toEqual([]);
  })

  it('should correctly copy the specified workflows', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3] }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1,
            layout: [fixtureWidgetLayoutItemA({ widgetId: widgetId1 }), fixtureWidgetLayoutItemB({ widgetId: widgetId2 })]
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2,
            layout: [fixtureWidgetLayoutItemC({ widgetId: widgetId3 })]
          }),
          ...fixtureWorkflowCInColl({
            id: workflowId3,
            layout: [fixtureWidgetLayoutItemD({ widgetId: widgetId4 })]
          }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 }),
          ...fixtureWidgetDInColl({ id: widgetId4 }),
        },
      },
    })
    const getId = (num: number) => `NEW-ID-${num}`
    let id = 1;
    const mockIdGen = jest.fn(() => getId(id++))
    const expectNewWflIds: CopyEntityResult[] = [
      { newId: getId(5), origId: workflowId1 },
      { newId: getId(8), origId: workflowId2 },
    ];
    const expectNewWgtIds: CopyEntityResult[] = [
      { newId: getId(1), origId: widgetId1 },
      { newId: getId(3), origId: widgetId2 },
      { newId: getId(6), origId: widgetId3 },
    ];
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [...initState.entities.projects[projectId1]!.workflowIds, getId(5), getId(8)],
            currentWorkflowId: getId(5)
          },
        },
        workflows: {
          ...initState.entities.workflows,
          [getId(5)]: {
            ...initState.entities.workflows[workflowId1]!,
            id: getId(5),
            layout: [
              { ...initState.entities.workflows[workflowId1]!.layout[0], id: getId(2), widgetId: getId(1) },
              { ...initState.entities.workflows[workflowId1]!.layout[1], id: getId(4), widgetId: getId(3) },
            ]
          },
          [getId(8)]: {
            ...initState.entities.workflows[workflowId2]!,
            id: getId(8),
            layout: [
              { ...initState.entities.workflows[workflowId2]!.layout[0], id: getId(7), widgetId: getId(6) },
            ]
          },
        },
        widgets: {
          ...initState.entities.widgets,
          [getId(1)]: {
            ...initState.entities.widgets[widgetId1]!,
            id: getId(1)
          },
          [getId(3)]: {
            ...initState.entities.widgets[widgetId2]!,
            id: getId(3)
          },
          [getId(6)]: {
            ...initState.entities.widgets[widgetId3]!,
            id: getId(6)
          },
        }
      }
    };

    const { newState, newWidgetIds, newWorkflowIds } = copyWorkflowsInAppState(initState, [workflowId1, workflowId2], projectId1, null, mockIdGen, true);

    expect(newState).toEqual(expectState);
    expect(newWorkflowIds).toEqual(expectNewWflIds)
    expect(newWidgetIds).toEqual(expectNewWgtIds)
  })

  it('should correctly set the workflowIds in the target project, when the target workflow position is specified', () => {
    const targetId = 'TARGET-ID'
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, targetId, workflowId2] }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1,
            layout: []
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2,
            layout: []
          }),
          ...fixtureWorkflowCInColl({
            id: targetId,
            layout: []
          }),
        },
      },
    })
    const getId = (num: number) => `NEW-ID-${num}`
    let id = 1;
    const mockIdGen = jest.fn(() => getId(id++))
    const expectNewWflIds: CopyEntityResult[] = [
      { newId: getId(1), origId: workflowId1 },
      { newId: getId(2), origId: workflowId2 },
    ];
    const expectNewWgtIds: CopyEntityResult[] = [];
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1, getId(1), getId(2), targetId, workflowId2],
            currentWorkflowId: getId(1)
          },
        },
        workflows: {
          ...initState.entities.workflows,
          [getId(1)]: {
            ...initState.entities.workflows[workflowId1]!,
            id: getId(1),
          },
          [getId(2)]: {
            ...initState.entities.workflows[workflowId2]!,
            id: getId(2),
          },
        },
      }
    };

    const { newState, newWidgetIds, newWorkflowIds } = copyWorkflowsInAppState(initState, [workflowId1, workflowId2], projectId1, targetId, mockIdGen, true);

    expect(newState).toEqual(expectState);
    expect(newWorkflowIds).toEqual(expectNewWflIds)
    expect(newWidgetIds).toEqual(expectNewWgtIds)
  })

  it('should add "Copy X" to the workflow copies, when keepNamesAsIs=false', () => {
    const wflName1 = 'Workflow 1'
    const wflName2 = 'Workflow 2'
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2, workflowId3] }),
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1,
            layout: [],
            settings: fixtureWorkflowSettingsA({
              name: wflName1
            })
          }),
          ...fixtureWorkflowBInColl({
            id: workflowId2,
            layout: [],
            settings: fixtureWorkflowSettingsB({
              name: wflName2
            })
          }),
          ...fixtureWorkflowCInColl({
            id: workflowId3,
            layout: [],
            settings: fixtureWorkflowSettingsC({
              name: wflName1 + ' Copy 1'
            })
          }),
        },
      },
    })
    const getId = (num: number) => `NEW-ID-${num}`
    let id = 1;
    const mockIdGen = jest.fn(() => getId(id++))
    const expectNewWflIds: CopyEntityResult[] = [
      { newId: getId(1), origId: workflowId1 },
      { newId: getId(2), origId: workflowId2 },
    ];
    const expectNewWgtIds: CopyEntityResult[] = [];
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId1]: {
            ...initState.entities.projects[projectId1]!,
            workflowIds: [workflowId1, workflowId2, workflowId3, getId(1), getId(2)],
            currentWorkflowId: getId(1)
          },
        },
        workflows: {
          ...initState.entities.workflows,
          [getId(1)]: {
            ...initState.entities.workflows[workflowId1]!,
            id: getId(1),
            settings: {
              ...initState.entities.workflows[workflowId1]!.settings,
              name: wflName1 + ' Copy 2'
            }
          },
          [getId(2)]: {
            ...initState.entities.workflows[workflowId2]!,
            id: getId(2),
            settings: {
              ...initState.entities.workflows[workflowId2]!.settings,
              name: wflName2 + ' Copy 1'
            }
          },
        },
      }
    };

    const { newState, newWidgetIds, newWorkflowIds } = copyWorkflowsInAppState(initState, [workflowId1, workflowId2], projectId1, null, mockIdGen, false);

    expect(newState).toEqual(expectState);
    expect(newWorkflowIds).toEqual(expectNewWflIds)
    expect(newWidgetIds).toEqual(expectNewWgtIds)
  })
})
