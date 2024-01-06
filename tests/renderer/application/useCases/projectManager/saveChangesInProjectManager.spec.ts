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

const newItemId = 'NEW-ITEM-ID';
jest.mock('@/base/state/actions', () => {
  const actual = jest.requireActual('@/base/state/actions');
  return {
    ...actual,
    addWorkflowToAppState: jest.fn(actual.addWorkflowToAppState),
    deleteProjectsFromAppState: jest.fn(actual.deleteProjectsFromAppState)
  }
})

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  let i = 1;
  const saveChangesInProjectManagerUseCase = createSaveChangesInProjectManagerUseCase({
    appStore,
    idGenerator: () => newItemId + (i++)
  });

  return {
    appStore,
    addWorkflowToAppState,
    deleteProjectsFromAppState,
    saveChangesInProjectManagerUseCase
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('saveChangesInProjectManagerUseCase()', () => {
  it('should do nothing, if projects is null', async () => {
    const initState = fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          projects: null,
          projectIds: ['SOME-ID'],
          deleteProjectIds: {}
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
        projectManager: fixtureProjectManager({
          projects: fixtureProjectAInColl(),
          projectIds: null,
          deleteProjectIds: { 'SOME-ID': true }
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
        projectManager: fixtureProjectManager({
          projects: fixtureProjectAInColl(),
          projectIds: [],
          deleteProjectIds: null
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

  it('should update the projects entities and the projects order in the project switcher, add a new workflow entity to every new project as a current workflow, and set the project manager data to null', async () => {
    const workflowA = fixtureWorkflowA();
    const workflowB = fixtureWorkflowB({ id: newItemId + '1', settings: fixtureWorkflowSettingsA({ name: 'Workflow 1' }) });
    const workflowC = fixtureWorkflowC({ id: newItemId + '2', settings: fixtureWorkflowSettingsB({ name: 'Workflow 1' }) });
    const projectA = fixtureProjectA();
    const projectB = fixtureProjectB({ currentWorkflowId: '', workflowIds: [] });
    const projectC = fixtureProjectC({ currentWorkflowId: '', workflowIds: [] });

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
        projectManager: fixtureProjectManager({
          projects: {
            [projectA.id]: updProjectA,
            [projectB.id]: projectB,
            [projectC.id]: projectC,
          },
          currentProjectId: projectA.id,
          projectIds: [projectB.id, projectA.id, projectC.id],
          deleteProjectIds: {}
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
          }
        },
      },
      ui: {
        ...initState.ui,
        projectSwitcher: {
          ...initState.ui.projectSwitcher,
          projectIds: [projectB.id, projectA.id, projectC.id],
          currentProjectId: projectA.id
        },
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projectIds: null,
          projects: null
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
          }
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          [projectA.id]: {
            ...initState.ui.projectManager.projects![projectA.id]!,
          },
          [projectD.id]: {
            ...initState.ui.projectManager.projects![projectD.id]!,
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
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projectIds: null,
          projects: null
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
        projectManager: fixtureProjectManager({
          projects: {
            [projectA.id]: updProjectA,
            [projectB.id]: projectB,
          },
          currentProjectId: projectA.id,
          projectIds: [projectB.id, projectA.id],
          deleteProjectIds: {
            [projectB.id]: false,
          }
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
        projectManager: fixtureProjectManager({
          projects: {
            [projectA.id]: projectA,
            [projectB.id]: projectB,
          },
          currentProjectId: projectA.id,
          projectIds: [projectB.id, projectA.id],
          deleteProjectIds: {}
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
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projectIds: null,
          projects: null
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
        projectManager: fixtureProjectManager({
          projects: {
          },
          currentProjectId: '',
          projectIds: [],
          deleteProjectIds: {}
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
        projectManager: {
          currentProjectId: '',
          deleteProjectIds: null,
          projectIds: null,
          projects: null
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
