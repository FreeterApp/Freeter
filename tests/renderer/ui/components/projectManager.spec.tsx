/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { createProjectManagerComponent, createProjectManagerViewModelHook} from '@/ui/components/projectManager';
import { createAppStateHook } from '@/ui/hooks/appState';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fixtureProjectSettingsA, fixtureProjectSettingsB } from '@tests/base/fixtures/project';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureProjectBInColl, fixtureProjectCInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectManager } from '@tests/base/state/fixtures/projectManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const addProjectInProjectManagerUseCase = jest.fn();
  const closeProjectManagerUseCase = jest.fn();
  const saveChangesInProjectManagerUseCase = jest.fn();
  const switchProjectInProjectManagerUseCase = jest.fn();
  const toggleDeletionInProjectManagerUseCase = jest.fn();
  const updateProjectSettingsInProjectManagerUseCase = jest.fn();
  const updateProjectsOrderInProjectManagerUseCase = jest.fn();
  const useProjectManagerViewModel = createProjectManagerViewModelHook({
    useAppState,
    addProjectInProjectManagerUseCase,
    closeProjectManagerUseCase,
    saveChangesInProjectManagerUseCase,
    switchProjectInProjectManagerUseCase,
    toggleDeletionInProjectManagerUseCase,
    updateProjectSettingsInProjectManagerUseCase,
    updateProjectsOrderInProjectManagerUseCase,
  })
  const ProjectManager = createProjectManagerComponent({
    useProjectManagerViewModel
  })
  const comp = render(
    <ProjectManager/>
  );

  return {
    comp,
    appStore,
    addProjectInProjectManagerUseCase,
    closeProjectManagerUseCase,
    saveChangesInProjectManagerUseCase,
    switchProjectInProjectManagerUseCase,
    toggleDeletionInProjectManagerUseCase,
    updateProjectSettingsInProjectManagerUseCase,
    updateProjectsOrderInProjectManagerUseCase,
  }
}

const classIsDropArea = 'is-drop-area';

describe('<ProjectManager />', () => {
  it('should not display the project manager, if the deleteProjectIds is null', async () => {
    await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: null,
          projects: {},
          projectIds: []
        })
      }
    }));

    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  })

  it('should not display the project manager, if the projects is null', async () => {
    await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {},
          projects: null,
          projectIds: []
        })
      }
    }));

    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  })

  it('should not display the project manager, if the projectIds is null', async () => {
    await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {},
          projects: {},
          projectIds: null
        })
      }
    }));

    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
  })

  it('should display the project manager, if all the required params are not null', async () => {
    await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {},
          projects: {},
          projectIds: []
        })
      }
    }));

    expect(screen.queryByText('Projects')).toBeInTheDocument();
  })

  it('should call a right usecase when clicking the cancel button', async () => {
    const {closeProjectManagerUseCase} = await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {},
          projects: {},
          projectIds: []
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /cancel/i
    });

    expect(closeProjectManagerUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeProjectManagerUseCase).toBeCalledTimes(1);
  })

  it('should call a right usecase with right params when clicking the ok button', async () => {
    const {saveChangesInProjectManagerUseCase} = await setup(fixtureAppState({
      ui: {
        projectManager: fixtureProjectManager({
          deleteProjectIds: {},
          projects: {},
          projectIds: []
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /ok/i
    });

    expect(saveChangesInProjectManagerUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(saveChangesInProjectManagerUseCase).toBeCalledTimes(1);
  })

  describe('Project List', () => {
    it('should display a tablist', async () => {
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {},
            projectIds: []
          })
        }
      }));
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should display 0 tabs, when there are 0 projects', async () => {
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {},
            projectIds: []
          })
        }
      }));
      expect(screen.queryAllByRole('tab').length).toBe(0);
    });

    it('should display 2 tabs, when there are 2 projects', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB]
          })
        }
      }));
      expect(screen.getAllByRole('tab').length).toBe(2);
    });

    it('should display project names', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB]
          })
        }
      }));
      expect(screen.getByText(nameA)).toBeInTheDocument();
      expect(screen.getByText(nameB)).toBeInTheDocument();
    });

    it('should display an action bar for each project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB]
          })
        }
      }));

      expect(screen.queryAllByRole('toolbar').length).toBe(2);
    })

    it('should display the delete project action for each project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB]
          })
        }
      }));

      expect(screen.queryAllByRole('button', {name: /delete project/i}).length).toBe(2);
    })

    it('should make the delete project action pressed for each project marked for deletion', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {[idA]: true, [idC]: true},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
              ...fixtureProjectCInColl({id: idC}),
            },
            projectIds: [idA, idB, idC]
          })
        }
      }));

      const delButtons = screen.queryAllByRole('button', {name: /delete project/i});
      expect(delButtons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(delButtons[1]).not.toHaveAttribute('aria-pressed');
      expect(delButtons[2]).toHaveAttribute('aria-pressed', 'true');
    })

    it('should call the toggle deletion usecase with right params, when clicking the Delete Project button', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const {toggleDeletionInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB]
          })
        }
      }));

      const elButton = screen.queryAllByRole('button', {name: /delete project/i})[1];
      fireEvent.click(elButton);

      expect(toggleDeletionInProjectManagerUseCase).toBeCalledTimes(1);
      expect(toggleDeletionInProjectManagerUseCase).toBeCalledWith(idB);
    })

    it('should display projects on the list in the right order', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB]
          })
        }
      }));

      const items = screen.getAllByRole('tab');
      expect(items[0]).toHaveTextContent(nameA);
      expect(items[1]).toHaveTextContent(nameB);
    });

    it('should mark the current project on the list', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB],
            currentProjectId: idB
          })
        }
      }));
      const items = screen.getAllByRole('tab');

      expect(items[0]).toHaveAttribute('aria-selected', 'false');
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('should call a right usecase with right params, when clicking a project item', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const {switchProjectInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB],
            currentProjectId: idA
          })
        }
      }))

      fireEvent.click(screen.getAllByRole('tab')[1]);

      expect(switchProjectInProjectManagerUseCase).toBeCalledTimes(1);
      expect(switchProjectInProjectManagerUseCase).toBeCalledWith(idB);
    })

    it('should display Add Project button', async () => {
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {},
            projectIds: []
          })
        }
      }));

      expect(screen.getByRole('button', {
        name: /Add Project/i
      })).toBeInTheDocument();
    });

    it('should call a right usecase with right params, when clicking Add Project button', async () => {
      const {addProjectInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {},
            projectIds: []
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Project/i
      }));

      expect(addProjectInProjectManagerUseCase).toBeCalledTimes(1);
      expect(addProjectInProjectManagerUseCase).toBeCalledWith();
    })

    it('should correctly set the is-drop-rea class and call the update projects order usecase when draging & dropping an item', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      const {updateProjectsOrderInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
              ...fixtureProjectCInColl({id: idC})
            },
            projectIds: [idA, idB, idC],
            currentProjectId: idA
          })
        }
      }))

      const tabEls = screen.getAllByRole('tab');

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);

      fireEvent.dragStart(tabEls[0]);

      fireEvent.dragEnter(tabEls[0]);
      fireEvent.dragOver(tabEls[0], {dataTransfer: {}});
      expect(tabEls[0]).toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[0]);

      fireEvent.dragEnter(tabEls[1]);
      fireEvent.dragOver(tabEls[1], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[1]);

      fireEvent.dragEnter(tabEls[2]);
      fireEvent.dragOver(tabEls[2], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).toHaveClass(classIsDropArea);
      expect(updateProjectsOrderInProjectManagerUseCase).toBeCalledTimes(0);
      fireEvent.drop(tabEls[2]);
      expect(updateProjectsOrderInProjectManagerUseCase).toBeCalledTimes(1);
      expect(updateProjectsOrderInProjectManagerUseCase).toBeCalledWith([idB, idC, idA]);
      fireEvent.dragEnd(tabEls[0]);

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
    });

    it('should do nothing when dragging something from outside', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      const {updateProjectsOrderInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
              ...fixtureProjectCInColl({id: idC})
            },
            projectIds: [idA, idB, idC],
            currentProjectId: idA
          })
        }
      }))

      const tabEls = screen.getAllByRole('tab');

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);

      fireEvent.dragEnter(tabEls[0]);
      fireEvent.dragOver(tabEls[0], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[0]);

      fireEvent.dragEnter(tabEls[1]);
      fireEvent.dragOver(tabEls[1], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[1]);

      fireEvent.dragEnter(tabEls[2]);
      fireEvent.dragOver(tabEls[2], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      expect(updateProjectsOrderInProjectManagerUseCase).toBeCalledTimes(0);
      fireEvent.drop(tabEls[2]);
      expect(updateProjectsOrderInProjectManagerUseCase).toBeCalledTimes(0);

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
    });

  })

  describe('Project Settings', () => {
    it('should not display a tabpanel, when there is not a selected project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB],
            currentProjectId: ''
          })
        }
      }));

      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    });

    it('should display a tabpanel, when there is a selected project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB],
            currentProjectId: idA
          })
        }
      }));

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should fill inputs with values of a first project, when it is selected', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB],
            currentProjectId: idA
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(nameA);
    })

    it('should fill inputs with values of a second project, when it is selected', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB],
            currentProjectId: idB
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(nameB);
    })

    it('should not focus the Name input field on init', async () => {
      const idA = 'P-A';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
            },
            projectIds: [idA],
            currentProjectId: idA
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).not.toHaveFocus();
    })

    it('should not focus the Name input field on project switch', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const initState = fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
              ...fixtureProjectBInColl({id: idB}),
            },
            projectIds: [idA, idB],
            currentProjectId: idA
          })
        }
      })
      const {appStore} = await setup(initState);

      act(()=>{
        appStore.set({
          ...initState,
          ui: {
            ...initState.ui,
            projectManager: {
              ...initState.ui.projectManager,
              currentProjectId: idB
            }
          }
        })
      })

      expect(screen.getByRole('textbox', { name: /^name$/i })).not.toHaveFocus();
    })

    it('should focus the Name input field, when adding a new project', async () => {
      const idA = 'P-A';
      await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA}),
            },
            projectIds: [idA],
            currentProjectId: idA
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Project/i
      }));

      const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: /^name$/i });
      expect(nameInput).toHaveFocus();
    })

    it('should call updateProjectSettingsInProjectManagerUseCase with right args when editing the name of a first project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      const addToName = '!';
      const settings = fixtureProjectSettingsA({ name: nameA });
      const {updateProjectSettingsInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB],
            currentProjectId: idA
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateProjectSettingsInProjectManagerUseCase).toBeCalledTimes(1);
      expect(updateProjectSettingsInProjectManagerUseCase).toBeCalledWith(idA, {
        ...settings,
        name: nameA+addToName
      })
    })

    it('should call updateProjectSettingsInProjectManagerUseCase with right args when editing the name of a second project', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'PROJECT NAME A';
      const nameB = 'PROJECT NAME B';
      const addToName = '!';
      const settings = fixtureProjectSettingsB({ name: nameB });
      const {updateProjectSettingsInProjectManagerUseCase} = await setup(fixtureAppState({
        ui: {
          projectManager: fixtureProjectManager({
            deleteProjectIds: {},
            projects: {
              ...fixtureProjectAInColl({id: idA, settings: fixtureProjectSettingsA({name: nameA})}),
              ...fixtureProjectBInColl({id: idB, settings: fixtureProjectSettingsB({name: nameB})}),
            },
            projectIds: [idA, idB],
            currentProjectId: idB
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateProjectSettingsInProjectManagerUseCase).toBeCalledTimes(1);
      expect(updateProjectSettingsInProjectManagerUseCase).toBeCalledWith(idB, {
        ...settings,
        name: nameB+addToName
      })
    })
  })
})
