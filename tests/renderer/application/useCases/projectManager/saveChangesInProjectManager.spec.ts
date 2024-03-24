/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSaveChangesInProjectManagerUseCase } from '@/application/useCases/projectManager/saveChangesInProjectManager';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureProjectA, fixtureProjectB, fixtureProjectC, fixtureProjectD, fixtureProjectSettingsA } from '@tests/base/fixtures/project';
import { fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { addWorkflowToAppState, deleteProjectsFromAppState } from '@/base/state/actions';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowSettingsA, fixtureWorkflowSettingsB } from '@tests/base/fixtures/workflow';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { createCloneWorkflowSubCase } from '@/application/useCases/workflow/subs/cloneWorkflow';
import { Workflow } from '@/base/workflow';
import { Project } from '@/base/project';
import { IdGenerator } from '@/application/interfaces/idGenerator';
import { createCloneWidgetSubCase } from '@/application/useCases/widget/subs/cloneWidget';
import { createCloneWidgetLayoutItemSubCase } from '@/application/useCases/workflow/subs/cloneWidgetLayoutItem';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC } from '@tests/base/fixtures/widget';
import { Widget } from '@/base/widget';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC } from '@tests/base/fixtures/widgetLayout';
import { WidgetLayoutItem } from '@/base/widgetLayout';

const newItemId = 'NEW-ITEM-ID';
jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual<typeof import('@/base/state/actions')>('@/base/state/actions');
  return {
    ...actual,
    addWorkflowToAppState: jest.fn(actual.addWorkflowToAppState),
    deleteProjectsFromAppState: jest.fn(actual.deleteProjectsFromAppState)
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  let i = 1;
  const projectIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newItemId + (i++))
  const workflowIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newItemId + (i++))
  const widgetIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newItemId + (i++))
  const widgetLayoutItemIdGeneratorMock: jest.MockedFn<IdGenerator> = jest.fn().mockImplementation(() => newItemId + (i++))
  const cloneWidgetSubCase = createCloneWidgetSubCase({
    idGenerator: widgetIdGeneratorMock,
    widgetDataStorageManager: {
      copyObjectData: jest.fn(),
      getObject: jest.fn()
    }
  })
  const cloneWidgetLayoutItemSubCase = createCloneWidgetLayoutItemSubCase({
    cloneWidgetSubCase,
    idGenerator: widgetLayoutItemIdGeneratorMock
  })
  const cloneWorkflowSubCase = createCloneWorkflowSubCase({
    cloneWidgetLayoutItemSubCase,
    idGenerator: workflowIdGeneratorMock
  });
  const saveChangesInProjectManagerUseCase = createSaveChangesInProjectManagerUseCase({
    appStore,
    cloneWorkflowSubCase,
    idGenerator: projectIdGeneratorMock
  });

  return {
    appStore,
    addWorkflowToAppState,
    deleteProjectsFromAppState,
    saveChangesInProjectManagerUseCase,
    projectIdGeneratorMock,
    workflowIdGeneratorMock,
    widgetLayoutItemIdGeneratorMock,
    widgetIdGeneratorMock
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('saveChangesInProjectManagerUseCase()', () => {
  it('should do nothing, if projects is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: null,
              projectIds: ['SOME-ID'],
              deleteProjectIds: {},
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if projectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: fixtureProjectAInColl(),
              projectIds: null,
              deleteProjectIds: { 'SOME-ID': true },
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if deleteProjectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: fixtureProjectAInColl(),
              projectIds: [],
              deleteProjectIds: null,
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should do nothing, if duplicateProjectIds is null', async () => {
    const initState = fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: fixtureProjectAInColl(),
              projectIds: [],
              deleteProjectIds: {},
              duplicateProjectIds: null
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    const expectState = appStore.get();
    await saveChangesInProjectManagerUseCase();

    expect(appStore.get()).toBe(expectState);
  })

  it('should update the projects entities and the projects order in the project switcher, add a new workflow entity to every new non-duplicate project as a current workflow, and reset the project manager data', async () => {
    const workflowA = fixtureWorkflowA();
    const workflowB = fixtureWorkflowB({ id: newItemId + '1', settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }) });
    const workflowC = fixtureWorkflowC({ id: newItemId + '2', settings: fixtureWorkflowSettingsB({ name: 'Workflow 1' }) });
    const projectA = fixtureProjectA({ currentWorkflowId: '', workflowIds: [] });
    const projectB = fixtureProjectB({ currentWorkflowId: '', workflowIds: [] });
    const projectC = fixtureProjectC({ currentWorkflowId: '', workflowIds: [] });
    const projectD = fixtureProjectD({ currentWorkflowId: '', workflowIds: [] });

    const updProjectA = fixtureProjectA({
      settings: fixtureProjectSettingsA({ name: 'New Name' })
    })
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowA.id]: workflowA
        },
        projects: {
          [projectA.id]: projectA,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectA.id],
          currentProjectId: projectA.id
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: updProjectA,
                [projectB.id]: projectB,
                [projectC.id]: projectC,
                [projectD.id]: projectD
              },
              currentProjectId: projectA.id,
              projectIds: [projectB.id, projectA.id, projectC.id, projectD.id],
              deleteProjectIds: {},
              duplicateProjectIds: { [projectD.id]: projectA.id }
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
          [workflowC.id]: workflowC,
        },
        projects: {
          [projectA.id]: updProjectA,
          [projectB.id]: {
            ...projectB,
            workflowIds: [workflowB.id],
            currentWorkflowId: workflowB.id
          },
          [projectC.id]: {
            ...projectC,
            workflowIds: [workflowC.id],
            currentWorkflowId: workflowC.id
          },
          [projectD.id]: projectD
        },
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectB.id, projectA.id, projectC.id, projectD.id],
          currentProjectId: projectA.id
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              duplicateProjectIds: null,
              projectIds: null,
              projects: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  });

  it('should update state with deleteProjectsFromAppState (for marked ids) after applying project and project order changes and resetting the project manager state, when there are marked projects', async () => {
    // const workflowA = fixtureWorkflowA({ id: newItemId + '1', settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }) });
    const workflowB = fixtureWorkflowB({ id: newItemId + '2', settings: fixtureWorkflowSettingsB({ name: 'Workflow 1' }) });
    const projectA = fixtureProjectA({ currentWorkflowId: '', workflowIds: [] });
    const projectB = fixtureProjectB({ currentWorkflowId: '', workflowIds: [] });
    const projectC = fixtureProjectC({ currentWorkflowId: '', workflowIds: [] });
    const projectD = fixtureProjectD({ currentWorkflowId: '', workflowIds: [] });
    const updProjectA = fixtureProjectA({
      settings: fixtureProjectSettingsA({ name: 'New Name' })
    })
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectA.id, projectB.id],
          currentProjectId: projectA.id
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: updProjectA,
                [projectB.id]: projectB,
                [projectC.id]: projectC,
                [projectD.id]: projectD,
              },
              currentProjectId: projectA.id,
              projectIds: [projectB.id, projectC.id, projectA.id, projectD.id],
              deleteProjectIds: {
                [projectB.id]: true,
                [projectC.id]: true,
                [projectD.id]: false,
              },
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectA.id]: {
            ...initState.ui.modalScreens.data.projectManager.projects![projectA.id]!,
          },
          [projectD.id]: {
            ...initState.ui.modalScreens.data.projectManager.projects![projectD.id]!,
            currentWorkflowId: workflowB.id,
            workflowIds: [workflowB.id]
          }
        },
        workflows: {
          [workflowB.id]: workflowB,
        }
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectA.id, projectD.id],
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              duplicateProjectIds: null,
              projectIds: null,
              projects: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      addWorkflowToAppState,
      deleteProjectsFromAppState,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    expect(addWorkflowToAppState).toBeCalledTimes(2); // 2x new projects created before processing the deletion marks
    expect(deleteProjectsFromAppState).toBeCalledTimes(1);
    expect(appStore.get()).toEqual(expectState);
  });

  it('should not update state with deleteProjectsFromAppState, when there are no marked projects', async () => {
    const projectA = fixtureProjectA();
    const projectB = fixtureProjectB();
    const updProjectA = fixtureProjectA({
      settings: fixtureProjectSettingsA({ name: 'New Name' })
    })
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectA.id, projectB.id],
          currentProjectId: projectA.id
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: updProjectA,
                [projectB.id]: projectB,
              },
              currentProjectId: projectA.id,
              projectIds: [projectB.id, projectA.id],
              deleteProjectIds: {
                [projectB.id]: false,
              },
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })

    const {
      deleteProjectsFromAppState,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    expect(deleteProjectsFromAppState).not.toBeCalled()
  })

  it('should correctly clone workflows for duplicate projects ids, when there are duplicate projects', async () => {
    const widgetA = fixtureWidgetA();
    const widgetAClone: Widget = { ...widgetA, id: widgetA.id + 'CLONE' };
    const widgetB = fixtureWidgetB();
    const widgetBClone: Widget = { ...widgetB, id: widgetB.id + 'CLONE' };
    const widgetC = fixtureWidgetC();
    const widgetCClone: Widget = { ...widgetC, id: widgetC.id + 'CLONE' };
    const widgetLayoutItemA = fixtureWidgetLayoutItemA({ widgetId: widgetA.id });
    const widgetLayoutItemAClone: WidgetLayoutItem = { ...widgetLayoutItemA, id: widgetLayoutItemA.id + 'CLONE', widgetId: widgetAClone.id };
    const widgetLayoutItemB = fixtureWidgetLayoutItemB({ widgetId: widgetB.id });
    const widgetLayoutItemBClone: WidgetLayoutItem = { ...widgetLayoutItemB, id: widgetLayoutItemB.id + 'CLONE', widgetId: widgetBClone.id };
    const widgetLayoutItemC = fixtureWidgetLayoutItemC({ widgetId: widgetC.id });
    const widgetLayoutItemCClone: WidgetLayoutItem = { ...widgetLayoutItemC, id: widgetLayoutItemC.id + 'CLONE', widgetId: widgetCClone.id };
    const workflowA = fixtureWorkflowA({ layout: [widgetLayoutItemA, widgetLayoutItemB] });
    const workflowAClone: Workflow = { ...workflowA, id: workflowA.id + 'CLONE', layout: [widgetLayoutItemAClone, widgetLayoutItemBClone] };
    const workflowB = fixtureWorkflowB({ layout: [widgetLayoutItemC] });
    const workflowBClone: Workflow = { ...workflowB, id: workflowB.id + 'CLONE', layout: [widgetLayoutItemCClone] };
    const workflowC = fixtureWorkflowC();
    const workflowCClone: Workflow = { ...workflowC, id: workflowC.id + 'CLONE' };
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const projectAClone: Project = { ...projectA, id: projectA.id + 'CLONE', currentWorkflowId: workflowAClone.id, workflowIds: [workflowAClone.id] };
    const projectB = fixtureProjectB({ currentWorkflowId: workflowB.id, workflowIds: [workflowB.id, workflowC.id] });
    const projectBClone: Project = { ...projectB, id: projectB.id + 'CLONE', currentWorkflowId: workflowBClone.id, workflowIds: [workflowBClone.id, workflowCClone.id] };
    const projectC = fixtureProjectC({ currentWorkflowId: 'NO-SUCH-ID', workflowIds: ['NO-SUCH-ID'] });
    const projectCClone: Project = { ...projectC, id: projectC.id + 'CLONE', currentWorkflowId: '', workflowIds: [] };
    const initState = fixtureAppState({
      entities: {
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
          [workflowC.id]: workflowC,
        },
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
          [projectC.id]: projectC,
        },
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
          [widgetC.id]: widgetC
        },
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectA.id],
          currentProjectId: projectA.id
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: projectA,
                [projectAClone.id]: {
                  ...projectA,
                  id: projectAClone.id,
                  currentWorkflowId: '',
                  workflowIds: []
                },
                [projectB.id]: projectB,
                [projectBClone.id]: {
                  ...projectB,
                  id: projectBClone.id,
                  currentWorkflowId: '',
                  workflowIds: []
                },
                [projectC.id]: projectC,
                [projectCClone.id]: {
                  ...projectC,
                  id: projectCClone.id,
                  currentWorkflowId: '',
                  workflowIds: []
                },
              },
              currentProjectId: projectA.id,
              projectIds: [projectA.id, projectAClone.id, projectB.id, projectBClone.id, projectC.id, projectCClone.id],
              deleteProjectIds: {},
              duplicateProjectIds: {
                [projectAClone.id]: projectA.id,
                [projectBClone.id]: projectB.id,
                [projectCClone.id]: projectC.id,
              }
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })

    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.ui.modalScreens.data.projectManager.projects!,
          [projectAClone.id]: projectAClone,
          [projectBClone.id]: projectBClone
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowAClone.id]: workflowAClone,
          [workflowBClone.id]: workflowBClone,
          [workflowCClone.id]: workflowCClone
        },
        widgets: {
          ...initState.entities.widgets,
          [widgetAClone.id]: widgetAClone,
          [widgetBClone.id]: widgetBClone,
          [widgetCClone.id]: widgetCClone
        }
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: initState.ui.modalScreens.data.projectManager.projectIds!,
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              duplicateProjectIds: null,
              projectIds: null,
              projects: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      projectIdGeneratorMock,
      widgetIdGeneratorMock,
      widgetLayoutItemIdGeneratorMock,
      workflowIdGeneratorMock,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)
    projectIdGeneratorMock.mockReturnValueOnce(projectAClone.id);
    workflowIdGeneratorMock.mockReturnValueOnce(workflowAClone.id);
    workflowIdGeneratorMock.mockReturnValueOnce(workflowBClone.id);
    workflowIdGeneratorMock.mockReturnValueOnce(workflowCClone.id);
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(widgetLayoutItemAClone.id)
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(widgetLayoutItemBClone.id)
    widgetLayoutItemIdGeneratorMock.mockReturnValueOnce(widgetLayoutItemCClone.id)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetAClone.id)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetBClone.id)
    widgetIdGeneratorMock.mockReturnValueOnce(widgetCClone.id)

    await saveChangesInProjectManagerUseCase();

    expect(appStore.get()).toEqual(expectState);
  });

  it('should update the current project id = first project on the list, when the id does not exist', async () => {
    const projectA = fixtureProjectA();
    const projectB = fixtureProjectB();

    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectB.id, projectA.id],
          currentProjectId: 'NO-SUCH-ID'
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
                [projectA.id]: projectA,
                [projectB.id]: projectB,
              },
              currentProjectId: projectA.id,
              projectIds: [projectB.id, projectA.id],
              deleteProjectIds: {},
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectA.id]: projectA,
          [projectB.id]: projectB,
        },
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectB.id, projectA.id],
          currentProjectId: projectB.id
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              duplicateProjectIds: null,
              projectIds: null,
              projects: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  });

  it('should update the current project id = empty, when the id does not exist and there are no projects', async () => {
    const initState = fixtureAppState({
      entities: {
        projects: {
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [],
          currentProjectId: 'NO-SUCH-ID'
        }),
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            projectManager: fixtureProjectManager({
              projects: {
              },
              currentProjectId: '',
              projectIds: [],
              deleteProjectIds: {},
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
        },
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [],
          currentProjectId: ''
        },
        modalScreens: {
          ...initState.ui.modalScreens,
          data: {
            ...initState.ui.modalScreens.data,
            projectManager: {
              currentProjectId: '',
              deleteProjectIds: null,
              duplicateProjectIds: null,
              projectIds: null,
              projects: null
            }
          },
          order: ['about']
        }
      }
    }

    const {
      appStore,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  });
})
