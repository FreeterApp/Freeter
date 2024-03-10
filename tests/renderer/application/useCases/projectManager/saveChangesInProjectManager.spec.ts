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
import { addWorkflowToAppState, copyProjectContentInAppState, deleteProjectsFromAppState } from '@/base/state/actions';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC, fixtureWorkflowSettingsA, fixtureWorkflowSettingsB } from '@tests/base/fixtures/workflow';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { ObjectManager } from '@common/base/objectManager';
import { DataStorageRenderer } from '@/application/interfaces/dataStorage';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetCoreSettingsA, fixtureWidgetCoreSettingsB } from '@tests/base/fixtures/widget';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB } from '@tests/base/fixtures/widgetLayout';

const newItemId = 'NEW-ITEM-ID';
jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual('@/base/state/actions');
  return {
    ...actual,
    addWorkflowToAppState: jest.fn(actual.addWorkflowToAppState),
    copyProjectContentInAppState: jest.fn(actual.copyProjectContentInAppState),
    deleteProjectsFromAppState: jest.fn(actual.deleteProjectsFromAppState)
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const widgetDataStorageManagerMock: ObjectManager<DataStorageRenderer> = {
    copyObjectData: jest.fn(),
    getObject: jest.fn(),
  };
  let i = 1;
  const saveChangesInProjectManagerUseCase = createSaveChangesInProjectManagerUseCase({
    appStore,
    widgetDataStorageManager: widgetDataStorageManagerMock,
    idGenerator: () => newItemId + (i++)
  });

  return {
    appStore,
    addWorkflowToAppState,
    copyProjectContentInAppState,
    deleteProjectsFromAppState,
    saveChangesInProjectManagerUseCase,
    widgetDataStorageManagerMock
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
    saveChangesInProjectManagerUseCase();

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
    saveChangesInProjectManagerUseCase();

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
    saveChangesInProjectManagerUseCase();

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
    saveChangesInProjectManagerUseCase();

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

    saveChangesInProjectManagerUseCase();

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

    saveChangesInProjectManagerUseCase();

    expect(addWorkflowToAppState).toBeCalledTimes(2); // 2x new projects created before processing the deletion marks
    expect(deleteProjectsFromAppState).toBeCalledTimes(1);
    expect(appStore.get()).toStrictEqual(expectState);
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

    saveChangesInProjectManagerUseCase();

    expect(deleteProjectsFromAppState).not.toBeCalled()
  })

  it('should update state with copyProjectContentInAppState (for duplicate projects ids) and copy widget data with widgetDataStorageManager\'s copyObjectData, when there are duplicate projects', async () => {
    const widgetA = fixtureWidgetA({ coreSettings: fixtureWidgetCoreSettingsA({ name: 'Widget 1' }) })
    const widgetACopy = fixtureWidgetA({ id: newItemId + '1', coreSettings: fixtureWidgetCoreSettingsA({ name: 'Widget 1' }) })
    const widgetB = fixtureWidgetB({ coreSettings: fixtureWidgetCoreSettingsB({ name: 'Widget 2' }) })
    const widgetBCopy = fixtureWidgetB({ id: newItemId + '3', coreSettings: fixtureWidgetCoreSettingsB({ name: 'Widget 2' }) })
    const workflowA = fixtureWorkflowA({ settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }), layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id }), fixtureWidgetLayoutItemB({ widgetId: widgetB.id })] });
    const workflowACopy = fixtureWorkflowA({ id: newItemId + '5', settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }), layout: [fixtureWidgetLayoutItemA({ id: newItemId + '2', widgetId: widgetACopy.id }), fixtureWidgetLayoutItemB({ id: newItemId + '4', widgetId: widgetBCopy.id })] });
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const projectACopy = fixtureProjectA({ id: newItemId + '6', currentWorkflowId: workflowACopy.id, workflowIds: [workflowACopy.id] });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB
        },
        workflows: {
          [workflowA.id]: workflowA,
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
                [projectA.id]: projectA,
                [projectACopy.id]: {
                  ...projectA,
                  id: projectACopy.id,
                  currentWorkflowId: '',
                  workflowIds: []
                }
              },
              currentProjectId: projectA.id,
              projectIds: [projectA.id, projectACopy.id],
              deleteProjectIds: {},
              duplicateProjectIds: {
                [projectACopy.id]: projectA.id
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
          ...initState.entities.projects,
          [projectACopy.id]: projectACopy
        },
        workflows: {
          ...initState.entities.workflows,
          [workflowACopy.id]: workflowACopy
        },
        widgets: {
          ...initState.entities.widgets,
          [widgetACopy.id]: widgetACopy,
          [widgetBCopy.id]: widgetBCopy
        }
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectA.id, projectACopy.id],
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
      copyProjectContentInAppState,
      widgetDataStorageManagerMock,
      saveChangesInProjectManagerUseCase
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    expect(copyProjectContentInAppState).toBeCalledTimes(1);
    expect(widgetDataStorageManagerMock.copyObjectData).toBeCalledTimes(2)
    expect(appStore.get()).toStrictEqual(expectState);
  });

  it('should not update state with copyProjectContentInAppState nor call the widgetDataStorageManager\'s copyObjectData, when there are no project duplicates', async () => {
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
              deleteProjectIds: {},
              duplicateProjectIds: {}
            })
          }),
          order: ['about', 'projectManager']
        })
      }
    })

    const {
      copyProjectContentInAppState,
      saveChangesInProjectManagerUseCase,
      widgetDataStorageManagerMock
    } = await setup(initState)

    await saveChangesInProjectManagerUseCase();

    expect(copyProjectContentInAppState).not.toBeCalled()
    expect(widgetDataStorageManagerMock.copyObjectData).not.toBeCalled()
  })

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

    saveChangesInProjectManagerUseCase();

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

    saveChangesInProjectManagerUseCase();

    const newState = appStore.get();
    expect(newState).toEqual(expectState);
  });
})
