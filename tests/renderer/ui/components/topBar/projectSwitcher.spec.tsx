/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createSwitchProjectUseCase } from '@/application/useCases/projectSwitcher/switchProject';
import { AppState } from '@/base/state/app';
import { createProjectSwitcherComponent, createProjectSwitcherViewModelHook} from '@/ui/components/topBar/projectSwitcher';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { fixtureProjectSettingsA } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureProjectBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const deactivateWorkflowUseCase = jest.fn();
  const switchProjectUseCase = jest.fn(createSwitchProjectUseCase({
    appStore,
    deactivateWorkflowUseCase
  }));
  const useProjectSwitcherViewModel = createProjectSwitcherViewModelHook({
    useAppState,
    switchProjectUseCase,
  })
  const ProjectSwitcher = createProjectSwitcherComponent({
    useProjectSwitcherViewModel
  })
  const comp = render(
    <ProjectSwitcher/>
  );

  return {
    comp,
    appStore,
    switchProjectUseCase,
  }
}

describe('<ProjectSwitcher />', () => {
  it('should display a dropdown', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should disable the dropdown and display a "no projects" selected option, when there are no projects', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.queryAllByRole('option', {name: /No projects/i, selected: true}).length).toBe(1);
  });

  it('should enable the dropdown and not display a "no projects" option, when there are projects', async () => {
    const idA = 'P-A';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idA]
        }
      }
    }))
    expect(screen.getByRole('combobox')).toBeEnabled();
    expect(screen.queryAllByRole('option', {name: /No projects/i}).length).toBe(0);
  });

  it('should display 3 options, when there are 2 projects', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
          ...fixtureProjectBInColl({id: idB}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idA, idB]
        }
      }
    }))
    expect(screen.getAllByRole('option').length).toBe(3);
  });

  it('should have 1st option = disabled "Select Project"', async () => {
    const idA = 'P-A';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idA]
        }
      }
    }))
    const elOpt = screen.getAllByRole('option')[0];
    expect(elOpt).toHaveTextContent(/Select Project/i);
    expect(elOpt).toBeDisabled();
  });

  it('should display "Select Project", when no project selected', async () => {
    const idA = 'P-A';
    const name = 'Project Name';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name})}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: '',
          projectIds: [idA]
        }
      }
    }))

    expect(screen.getByRole('combobox')).toHaveDisplayValue(/Select Project/i);
  });

  it('should display "Select Project", when selected project does not exist', async () => {
    const idA = 'P-A';
    const name = 'Project Name';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name})}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: 'NO-SUCH-ID',
          projectIds: [idA]
        }
      }
    }))

    expect(screen.getByRole('combobox')).toHaveDisplayValue(/Select Project/i);
  });

  it('should display the name of the selected project', async () => {
    const idA = 'P-A';
    const name = 'Project Name';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name})}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idA]
        }
      }
    }))

    expect(screen.getByRole('combobox')).toHaveDisplayValue(name);
  });

  it('should display options in the right order', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
          ...fixtureProjectBInColl({id: idB}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idB, idA]
        }
      }
    }))

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveValue('');
    expect(options[1]).toHaveValue(idB);
    expect(options[2]).toHaveValue(idA);
  });

  it('should set a selected option, depending on the current project value', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    const state: AppState = fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
          ...fixtureProjectBInColl({id: idB}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idB,
          projectIds: [idA, idB]
        }
      }
    })
    const {appStore} = await setup(state)

    expect(screen.getByRole('combobox')).toHaveValue(idB);

    act(() => {
      appStore.set({
        ...state,
        ui: {
          ...state.ui,
          projectSwitcher: {
            ...state.ui.projectSwitcher,
            currentProjectId: idA
          }
        }
      })
    })
    expect(screen.getByRole('combobox')).toHaveValue(idA);
  })

  it('should call a right usecase with right params, when switching project', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    const {switchProjectUseCase} = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idA}),
          ...fixtureProjectBInColl({id: idB}),
        }
      },
      ui: {
        projectSwitcher: {
          currentProjectId: idA,
          projectIds: [idB, idA]
        }
      }
    }))

    fireEvent.change(screen.getByRole('combobox'), { target: { value: idB } });

    expect(switchProjectUseCase).toBeCalledTimes(1);
    expect(switchProjectUseCase).toBeCalledWith(idB);
  })
})
