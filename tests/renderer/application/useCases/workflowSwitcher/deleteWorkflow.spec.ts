/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDeleteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/deleteWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureProjectAInColl, fixtureWidgetAInColl, fixtureWidgetBInColl, fixtureWidgetCInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';
import { mockDialogProvider } from '@tests/infra/mocks/dialogProvider';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB } from '@tests/base/fixtures/widgetLayout';

async function setup(initState: AppState, opts?: { mockShowMessageBoxRes?: number }) {
  const [appStore] = await fixtureAppStore(initState);
  const dialogProviderMock = mockDialogProvider({
    showMessageBox: jest.fn().mockResolvedValue({
      response: opts?.mockShowMessageBoxRes !== undefined ? opts.mockShowMessageBoxRes : 1
    } as MessageBoxResult)
  })

  const deactivateWorkflowUseCase = jest.fn();
  const deleteWorkflowUseCase = createDeleteWorkflowUseCase({
    appStore,
    dialog: dialogProviderMock,
    deactivateWorkflowUseCase
  });
  return {
    appStore,
    dialogProviderMock,
    deleteWorkflowUseCase,
  }
}

describe('deleteWorkflowUseCase()', () => {
  it('should do nothing, if no project is selected in the project switcher', async () => {
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ workflowIds: [workflowId1, workflowId2] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: ''
        })
      }
    })
    const {
      appStore,
      deleteWorkflowUseCase,
      dialogProviderMock
    } = await setup(initState)

    const expectState = appStore.get();
    await deleteWorkflowUseCase(workflowId1);

    expect(appStore.get()).toBe(expectState);
    expect(dialogProviderMock.showMessageBox).not.toBeCalled();
  })

  it('should do nothing, if the selected project does not exist', async () => {
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ workflowIds: [workflowId1, workflowId2] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: 'NO-SUCH-ID'
        })
      }
    })
    const {
      appStore,
      deleteWorkflowUseCase,
      dialogProviderMock
    } = await setup(initState)

    const expectState = appStore.get();
    await deleteWorkflowUseCase(workflowId1);

    expect(appStore.get()).toBe(expectState);
    expect(dialogProviderMock.showMessageBox).not.toBeCalled();
  })

  it('should do nothing, if the specified workflow does not exist', async () => {
    const projectId = 'PROJECT-ID';
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId, workflowIds: [workflowId1, workflowId2] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    })
    const {
      appStore,
      deleteWorkflowUseCase,
      dialogProviderMock
    } = await setup(initState)

    const expectState = appStore.get();
    await deleteWorkflowUseCase('NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
    expect(dialogProviderMock.showMessageBox).not.toBeCalled();
  })

  it('should show a message box asking for a Ok/Cancel confirmation', async () => {
    const projectId = 'PROJECT-ID';
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId, workflowIds: [workflowId1, workflowId2] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    })
    const {
      appStore,
      deleteWorkflowUseCase,
      dialogProviderMock
    } = await setup(initState)

    const expectState = appStore.get();
    await deleteWorkflowUseCase(workflowId1);

    expect(appStore.get()).toBe(expectState);
    expect(dialogProviderMock.showMessageBox).toBeCalled();
    expect(dialogProviderMock.showMessageBox).toBeCalledWith(expect.objectContaining({ buttons: ['Ok', 'Cancel'] } as MessageBoxConfig));
  })

  it('should do nothing, when the message box returns "Cancel"', async () => {
    const projectId = 'PROJECT-ID';
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId, workflowIds: [workflowId1, workflowId2] })
        },
        workflows: {
          ...fixtureWorkflowAInColl({ id: workflowId1 }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    })
    const {
      appStore,
      deleteWorkflowUseCase,
    } = await setup(initState, { mockShowMessageBoxRes: 1 })

    const expectState = appStore.get();
    await deleteWorkflowUseCase(workflowId1);

    expect(appStore.get()).toBe(expectState);
  })

  it('should correctly update the state, when the message box returns "Ok"', async () => {

    const projectId = 'PROJECT-ID';
    const workflowId1 = 'WORKFLOW-ID1';
    const workflowId2 = 'WORKFLOW-ID2';
    const widgetId1 = 'WIDGET-ID1';
    const widgetId2 = 'WIDGET-ID2';
    const widgetId3 = 'WIDGET-ID3';
    const initState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({ id: projectId, workflowIds: [workflowId1, workflowId2], currentWorkflowId: workflowId2 })
        },
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId1, layout: [
              fixtureWidgetLayoutItemA({ widgetId: widgetId1 }),
              fixtureWidgetLayoutItemB({ widgetId: widgetId2 })
            ]
          }),
          ...fixtureWorkflowBInColl({ id: workflowId2 }),
        },
        widgets: {
          ...fixtureWidgetAInColl({ id: widgetId1 }),
          ...fixtureWidgetBInColl({ id: widgetId2 }),
          ...fixtureWidgetCInColl({ id: widgetId3 })
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId
        })
      }
    })
    const expectState: AppState = {
      ...initState,
      entities: {
        ...initState.entities,
        projects: {
          ...initState.entities.projects,
          [projectId]: {
            ...initState.entities.projects[projectId]!,
            currentWorkflowId: workflowId2,
            workflowIds: [workflowId2]
          }
        },
        workflows: {
          [workflowId2]: initState.entities.workflows[workflowId2]
        },
        widgets: {
          [widgetId3]: initState.entities.widgets[widgetId3]
        }
      }
    }
    const {
      appStore,
      deleteWorkflowUseCase,
    } = await setup(initState, { mockShowMessageBoxRes: 0 })

    await deleteWorkflowUseCase(workflowId1);

    expect(appStore.get()).toEqual(expectState);
  })
})
