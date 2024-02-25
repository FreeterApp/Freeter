/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { createWorkflowSettingsComponent, createWorkflowSettingsViewModelHook} from '@/ui/components/workflowSettings'
import { fixtureWorkflowA, fixtureWorkflowSettingsA } from '@tests/base/fixtures/workflow';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWorkflowSettings } from '@tests/base/state/fixtures/workflowSettings';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import userEvent from '@testing-library/user-event';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';

const workflowId = 'Workflow-ID';

async function setup(
  appState: AppState,
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const closeWorkflowSettingsUseCase = jest.fn();
  const updateWorkflowSettingsUseCase = jest.fn();
  const saveWorkflowSettingsUseCase = jest.fn();

  const useWorkflowSettingsViewModel = createWorkflowSettingsViewModelHook({
    useAppState,
    closeWorkflowSettingsUseCase,
    updateWorkflowSettingsUseCase,
    saveWorkflowSettingsUseCase,
  })

  const WorkflowSettings = createWorkflowSettingsComponent({
    useWorkflowSettingsViewModel
  })
  const comp = render(
    <WorkflowSettings />
  );

  return {
    comp,
    appStore,
    saveWorkflowSettingsUseCase,
    closeWorkflowSettingsUseCase,
    updateWorkflowSettingsUseCase,
  }
}

describe('<WorkflowSettings />', () => {
  it('should not display the settings dialog, if the workflow is null', async () => {
    await setup(fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl(),
          ...fixtureWorkflowBInColl()
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: null
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Workflow Settings')).not.toBeInTheDocument();
  })

  it('should display the settings dialog, if the workflow is set', async () => {
    await setup(fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
          }),
          ...fixtureWorkflowBInColl()
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: fixtureWorkflowA({id: workflowId}),
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Workflow Settings')).toBeInTheDocument();
  })

  it('should call a right usecase when clicking the close button', async () => {
    const {closeWorkflowSettingsUseCase} = await setup(fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
          }),
          ...fixtureWorkflowBInColl()
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: fixtureWorkflowA({
                id: workflowId,
              }),
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /cancel/i
    });

    expect(closeWorkflowSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeWorkflowSettingsUseCase).toBeCalledTimes(1);
  })

  it('should call a right usecase with right params when clicking the save button', async () => {
    const {saveWorkflowSettingsUseCase} = await setup(fixtureAppState({
      entities: {
        workflows: {
          ...fixtureWorkflowAInColl({
            id: workflowId,
          }),
          ...fixtureWorkflowBInColl()
        }
      },
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            workflowSettings: fixtureWorkflowSettings({
              workflow: fixtureWorkflowA({
                id: workflowId,
              }),
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /ok/i
    });

    expect(saveWorkflowSettingsUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(saveWorkflowSettingsUseCase).toBeCalledTimes(1);
  })



  describe('Settings Controls', () => {
    it('should fill inputs with right values', async () => {
      const settings = fixtureWorkflowSettingsA({ name: 'Some Name' });
      await setup(fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
            }),
            ...fixtureWorkflowBInColl()
          }
        },
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              workflowSettings: fixtureWorkflowSettings({
                workflow: fixtureWorkflowA({id: workflowId, settings}),
              })
            })
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(settings.name);
    })

    it('should call updateWorkflowSettingsUseCase with right args when editing the name', async () => {
      const curName = 'Workflow Name';
      const addToName = 'e';
      const settings = fixtureWorkflowSettingsA({ name: curName });
      const {updateWorkflowSettingsUseCase} = await setup(fixtureAppState({
        entities: {
          workflows: {
            ...fixtureWorkflowAInColl({
              id: workflowId,
            }),
            ...fixtureWorkflowBInColl()
          }
        },
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              workflowSettings: fixtureWorkflowSettings({
                workflow: fixtureWorkflowA({id: workflowId, settings}),
              })
            })
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateWorkflowSettingsUseCase).toBeCalledTimes(1);
      expect(updateWorkflowSettingsUseCase).toBeCalledWith({
        ...settings,
        name: curName+addToName
      })
    })
  })
})
