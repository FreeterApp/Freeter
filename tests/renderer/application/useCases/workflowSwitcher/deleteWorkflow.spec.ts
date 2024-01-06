/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createDeleteWorkflowUseCase } from '@/application/useCases/workflowSwitcher/deleteWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureProjectAInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { DialogProvider } from '@/application/interfaces/dialogProvider';
import { MessageBoxConfig, MessageBoxResult } from '@common/base/dialog';
import { deleteWorkflowsFromAppState } from '@/base/state/actions';

jest.mock('@/base/state/actions');
const mockedDeleteWorkflowsFromAppState = jest.mocked(deleteWorkflowsFromAppState);

async function setup(initState: AppState, opts?: { mockShowMessageBoxRes?: number, mockDeleteWorkflowsFromAppStateRes?: AppState }) {
  const [appStore] = await fixtureAppStore(initState);
  const dialogProviderMock: DialogProvider = {
    showMessageBox: jest.fn().mockResolvedValue({
      response: opts?.mockShowMessageBoxRes !== undefined ? opts.mockShowMessageBoxRes : 1
    } as MessageBoxResult)
  }

  if (opts?.mockDeleteWorkflowsFromAppStateRes) {
    mockedDeleteWorkflowsFromAppState.mockClear();
    mockedDeleteWorkflowsFromAppState.mockImplementation(() => opts.mockDeleteWorkflowsFromAppStateRes!)
  } else {
    mockedDeleteWorkflowsFromAppState.mockRestore();
  }

  const deleteWorkflowUseCase = createDeleteWorkflowUseCase({
    appStore,
    dialog: dialogProviderMock
  });
  return {
    appStore,
    dialogProviderMock,
    mockedDeleteWorkflowsFromAppState,
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

  it('should call deleteWorkflowsFromAppState with right params, and update the state in the store with the returned value, when the message box returns "Ok"', async () => {

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
    const updState = {
      ...initState,
      workflows: {} // we don't need the correct result here
    };
    const {
      appStore,
      deleteWorkflowUseCase,
      mockedDeleteWorkflowsFromAppState,
    } = await setup(initState, { mockShowMessageBoxRes: 0, mockDeleteWorkflowsFromAppStateRes: updState })

    await deleteWorkflowUseCase(workflowId1);

    expect(mockedDeleteWorkflowsFromAppState).toBeCalledTimes(1);
    expect(mockedDeleteWorkflowsFromAppState).toBeCalledWith(initState, projectId, [workflowId1])
    expect(appStore.get()).toStrictEqual(updState);
  })
})
