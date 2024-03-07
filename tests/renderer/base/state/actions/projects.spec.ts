/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureProjectBInColl, fixtureProjectCInColl, fixtureProjectDInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl, fixtureWorkflowCInColl, fixtureWorkflowDInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWidgetDInColl } from '@tests/base/state/fixtures/entitiesState';
import { CopyEntityResult, copyProjectContentInAppState, deleteProjectsFromAppState } from '@/base/state/actions';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';

const projectId1 = 'PROJECT-ID1';
const projectId2 = 'PROJECT-ID2';
const projectId3 = 'PROJECT-ID3';
const projectId4 = 'PROJECT-ID4';
const workflowId1 = 'WORKFLOW-ID1';
const workflowId2 = 'WORKFLOW-ID2';
const workflowId3 = 'WORKFLOW-ID3';
const workflowId4 = 'WORKFLOW-ID4';
const widgetId1 = 'WIDGET-ID1';
const widgetId2 = 'WIDGET-ID2';
const widgetId3 = 'WIDGET-ID3';
const widgetId4 = 'WIDGET-ID4';

describe('deleteProjectsFromAppState()', () => {

  it('should do nothing, if the specified projects do not exist', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2],
          currentProjectId: projectId1
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 })
        },
      },
    })
    const expectState = initState;

    const gotState = deleteProjectsFromAppState(initState, ['NO-SUCH-ID', 'NO-SUCH-ID-AGAIN']);

    expect(gotState).toBe(expectState);
  })


  it('should delete the ids from the project switcher\'s list of projects, and delete the project entities, excluding the ids that don\'t exist on the project switcher\'s list', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2],
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 }),
          ...fixtureProjectBInColl({ id: projectId2 }),
          ...fixtureProjectCInColl({ id: projectId3 }),
        },
      },
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectId2],
        }
      },
      entities: {
        ...initState.entities,
        projects: {
          [projectId2]: initState.entities.projects[projectId2]!,
          [projectId3]: initState.entities.projects[projectId3]!,
        },
      }
    };

    const gotState = deleteProjectsFromAppState(initState, [projectId1, projectId3]);

    expect(gotState).toEqual(expectState);
  })

  it('should correctly update the current project id of the project switcher, when it is at the beginning of the list and deleted', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2, projectId3, projectId4],
          currentProjectId: projectId1
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 }),
          ...fixtureProjectBInColl({ id: projectId2 }),
          ...fixtureProjectCInColl({ id: projectId3 }),
          ...fixtureProjectDInColl({ id: projectId4 }),
        },
      },
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectId3, projectId4],
          currentProjectId: projectId3
        }
      },
      entities: {
        ...initState.entities,
        projects: {
          [projectId3]: initState.entities.projects[projectId3]!,
          [projectId4]: initState.entities.projects[projectId4]!,
        },
      }
    };

    expect(deleteProjectsFromAppState(initState, [projectId1, projectId2])).toEqual(expectState);
  })
  it('should correctly update the current project id of the project switcher, when it is in the middle of the list and deleted', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2, projectId3, projectId4],
          currentProjectId: projectId3
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 }),
          ...fixtureProjectBInColl({ id: projectId2 }),
          ...fixtureProjectCInColl({ id: projectId3 }),
          ...fixtureProjectDInColl({ id: projectId4 }),
        },
      },
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectId1, projectId4],
          currentProjectId: projectId4
        }
      },
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: initState.entities.projects[projectId1]!,
          [projectId4]: initState.entities.projects[projectId4]!,
        },
      }
    };

    expect(deleteProjectsFromAppState(initState, [projectId2, projectId3])).toEqual(expectState);
  })

  it('should correctly update the current project id of the project switcher, when it is at the end of the list and deleted', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2, projectId3, projectId4],
          currentProjectId: projectId4
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 }),
          ...fixtureProjectBInColl({ id: projectId2 }),
          ...fixtureProjectCInColl({ id: projectId3 }),
          ...fixtureProjectDInColl({ id: projectId4 }),
        },
      },
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectId1, projectId2],
          currentProjectId: projectId2
        }
      },
      entities: {
        ...initState.entities,
        projects: {
          [projectId1]: initState.entities.projects[projectId1]!,
          [projectId2]: initState.entities.projects[projectId2]!,
        },
      }
    };

    expect(deleteProjectsFromAppState(initState, [projectId3, projectId4])).toEqual(expectState);
  })

  it('should correctly update the current project id of the project switcher, when all items deleted', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2, projectId3, projectId4],
          currentProjectId: projectId3
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1 }),
          ...fixtureProjectBInColl({ id: projectId2 }),
          ...fixtureProjectCInColl({ id: projectId3 }),
          ...fixtureProjectDInColl({ id: projectId4 }),
        },
      },
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [],
          currentProjectId: ''
        }
      },
      entities: {
        ...initState.entities,
        projects: {
        },
      }
    };

    expect(deleteProjectsFromAppState(initState, [projectId1, projectId2, projectId3, projectId4])).toEqual(expectState);
  })

  it('should delete all workflow and widget entities using ids from all the deleted projects\' workflows and their widget layouts', () => {
    const initState = fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId1, projectId2, projectId3],
          currentProjectId: projectId3
        })
      },
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId3] }),
          ...fixtureProjectCInColl({ id: projectId3, workflowIds: [workflowId4] }),
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
          ...fixtureWorkflowCInColl({
            id: workflowId3, layout: [
              fixtureWidgetLayoutItemD({ widgetId: widgetId4 })
            ]
          }),
          ...fixtureWorkflowDInColl({
            id: workflowId4
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
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectId2],
          currentProjectId: projectId2
        }
      },
      entities: {
        ...initState.entities,
        projects: {
          [projectId2]: initState.entities.projects[projectId2]!,
        },
        workflows: {
          [workflowId3]: initState.entities.workflows[workflowId3]!,
        },
        widgets: {
          [widgetId4]: initState.entities.widgets[widgetId4]!,
        },
      }
    };

    const gotState = deleteProjectsFromAppState(initState, [projectId1, projectId3]);

    expect(gotState).toEqual(expectState);
  })
})

describe('copyProjectContentInAppState()', () => {
  it('should do nothing, if the "from" projects do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId3] })
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

    const { newState, newWidgetIds, newWorkflowIds } = copyProjectContentInAppState(initState, [['NO-SUCH-ID', projectId1], ['NO-SUCH-ID', projectId2]], () => '');

    expect(newState).toBe(expectState);
    expect(newWidgetIds).toEqual([]);
    expect(newWorkflowIds).toEqual([]);
  })

  it('should do nothing, if the "to" projects do not exist', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId3] })
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

    const { newState, newWidgetIds, newWorkflowIds } = copyProjectContentInAppState(initState, [[projectId1, 'NO-SUCH-ID'], [projectId2, 'NO-SUCH-ID']], () => '');

    expect(newState).toBe(expectState);
    expect(newWidgetIds).toEqual([]);
    expect(newWorkflowIds).toEqual([]);
  })

  it('should correctly copy all workflows and widgets', () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId1, workflowIds: [workflowId1, workflowId2] }),
          ...fixtureProjectBInColl({ id: projectId2, workflowIds: [workflowId3] }),
          ...fixtureProjectCInColl({ id: projectId3, workflowIds: [] }),
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
            layout: [fixtureWidgetLayoutItemC({ widgetId: widgetId4 })]
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
      { newId: getId(13), origId: workflowId1 },
      { newId: getId(16), origId: workflowId2 },
    ];
    const expectNewWgtIds: CopyEntityResult[] = [
      { newId: getId(1), origId: widgetId1 },
      { newId: getId(3), origId: widgetId2 },
      { newId: getId(6), origId: widgetId3 },
      { newId: getId(9), origId: widgetId1 },
      { newId: getId(11), origId: widgetId2 },
      { newId: getId(14), origId: widgetId3 },
    ];
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId2]: {
            ...initState.entities.projects[projectId2]!,
            workflowIds: [...initState.entities.projects[projectId2]!.workflowIds, getId(5), getId(8)],
            currentWorkflowId: getId(5)
          },
          [projectId3]: {
            ...initState.entities.projects[projectId3]!,
            workflowIds: [...initState.entities.projects[projectId3]!.workflowIds, getId(13), getId(16)],
            currentWorkflowId: getId(13)
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
          [getId(13)]: {
            ...initState.entities.workflows[workflowId1]!,
            id: getId(13),
            layout: [
              { ...initState.entities.workflows[workflowId1]!.layout[0], id: getId(10), widgetId: getId(9) },
              { ...initState.entities.workflows[workflowId1]!.layout[1], id: getId(12), widgetId: getId(11) },
            ]
          },
          [getId(16)]: {
            ...initState.entities.workflows[workflowId2]!,
            id: getId(16),
            layout: [
              { ...initState.entities.workflows[workflowId2]!.layout[0], id: getId(15), widgetId: getId(14) },
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
          [getId(9)]: {
            ...initState.entities.widgets[widgetId1]!,
            id: getId(9)
          },
          [getId(11)]: {
            ...initState.entities.widgets[widgetId2]!,
            id: getId(11)
          },
          [getId(14)]: {
            ...initState.entities.widgets[widgetId3]!,
            id: getId(14)
          },
        }
      }
    };

    const { newState, newWidgetIds, newWorkflowIds } = copyProjectContentInAppState(
      initState,
      [[projectId1, projectId2], [projectId1, projectId3]],
      mockIdGen
    );

    expect(newState).toEqual(expectState);
    expect(newWorkflowIds).toEqual(expectNewWflIds)
    expect(newWidgetIds).toEqual(expectNewWgtIds)
  })
})
