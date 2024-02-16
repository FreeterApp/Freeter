/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { createWorkflowSwitcherComponent, createWorkflowSwitcherViewModelHook } from '@/ui/components/workflowSwitcher'
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureWorkflowAInColl, fixtureWorkflowBInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureDragDropFromWorkflowSwitcher, fixtureDragDropNotDragging, fixtureDragDropOverWorkflowSwitcher } from '@tests/base/state/fixtures/dragDropState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureWorkflowSettingsA, fixtureWorkflowSettingsB } from '@tests/base/fixtures/workflow';
import { createAddWorkflowUseCase } from '@/application/useCases/workflowSwitcher/addWorkflow';
import userEvent from '@testing-library/user-event';
import { fixtureWorktableNotResizing, fixtureWorktableResizingItem } from '@tests/base/state/fixtures/worktable';

const newWorkflowId = 'NEW-WORKFLOW-ID';

async function setup(
  appState: AppState,
  opts?: {
    mockAddWorkflowUseCase?: jest.Mock
  }
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const switchWorkflowUseCase = jest.fn();
  const dragEndUseCase = jest.fn();
  const dragWorkflowFromWorkflowSwitcherUseCase = jest.fn();
  const dragOverWorkflowSwitcherUseCase = jest.fn();
  const dragLeaveTargetUseCase = jest.fn();
  const dropOnWorkflowSwitcherUseCase = jest.fn();
  const openWorkflowSettingsUseCase = jest.fn();
  const addWorkflowUseCase = opts?.mockAddWorkflowUseCase || createAddWorkflowUseCase({appStore, idGenerator: () => newWorkflowId});
  const renameWorkflowUseCase = jest.fn();
  const deleteWorkflowUseCase = jest.fn();

  const useWorkflowSwitcherViewModel = createWorkflowSwitcherViewModelHook({
    useAppState,
    switchWorkflowUseCase,
    dragEndUseCase,
    dragLeaveTargetUseCase,
    dragOverWorkflowSwitcherUseCase,
    dragWorkflowFromWorkflowSwitcherUseCase,
    dropOnWorkflowSwitcherUseCase,
    openWorkflowSettingsUseCase,
    addWorkflowUseCase,
    renameWorkflowUseCase,
    deleteWorkflowUseCase,
  })
  const WorkflowSwitcher = createWorkflowSwitcherComponent({
    useWorkflowSwitcherViewModel
  })
  const comp = render(
    <WorkflowSwitcher/>
  );

  return {
    comp,
    appStore,
    switchWorkflowUseCase,
    dragEndUseCase,
    dragWorkflowFromWorkflowSwitcherUseCase,
    dragOverWorkflowSwitcherUseCase,
    dragLeaveTargetUseCase,
    dropOnWorkflowSwitcherUseCase,
    openWorkflowSettingsUseCase,
    addWorkflowUseCase,
    renameWorkflowUseCase,
    deleteWorkflowUseCase,
  }
}

const classIsDropArea = 'is-drop-area';
const dragItemId = 'DRAG-ITEM-ID';
const overItemId = 'OVER-ITEM-ID';

describe('<WorkflowSwitcher />', () => {
  describe('when current project does not exist', () => {
    it('should not display a tablist', async () => {
      await setup(fixtureAppState({}));
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });
  })

  describe('when current project exists', () => {
    it('should display a tablist', async () => {
      const id = 'P-A';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id})
          }
        },
        ui: {
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [id],
            currentProjectId: id
          })
        }
      }));

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should display a root action bar', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            })
          }
        })
      );

      expect(screen.getByRole('button', {name: 'Add Workflow'})).toBeInTheDocument();
    })

    it('should display edit-mode actions on a tab, when edit mode is on', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            })
          }
        })
      );

      expect(screen.queryAllByRole('button', {name: /add workflow/i}).length).toBe(1);
    })

    it('should not display edit-mode actions on a tab, when edit mode is off', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            editMode: false,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            })
          }
        })
      );

      expect(screen.queryAllByRole('button', {name: /add workflow/i}).length).toBe(0);
    })

    it('should call the add workflow usecase with right params, when clicking the Add Workflow button', async () => {
      const id = 'P-A';
      const {addWorkflowUseCase} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            })
          }
        }), {
          mockAddWorkflowUseCase: jest.fn()
        });

      const elButton = screen.getByRole('button', {name: /add workflow/i});
      fireEvent.click(elButton);

      expect(addWorkflowUseCase).toBeCalledTimes(1);
      expect(addWorkflowUseCase).toBeCalledWith();
    })

    it('should not display the Name input field in tabs on init', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      expect(screen.queryByRole('textbox', { name: /^name$/i })).not.toBeInTheDocument();
    })

    it('should display and focus the Name input field with a value=name in the current (added) tab, when adding a new workflow', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: 'Workflow 1'})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: 'Workflow 2'})}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Workflow/i
      }));

      const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: /^name$/i });
      expect(screen.getAllByRole('tab')[2].parentElement).toContainElement(nameInput);
      expect(nameInput).toHaveValue('Workflow 3');
      expect(nameInput).toHaveFocus();
    })

    it('should not display the Name input field, when clicking a non current tab', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB], currentWorkflowId: idWB})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: 'Workflow 1'})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: 'Workflow 2'})}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      const elNonCurTab = screen.getAllByRole('tab')[0];

      fireEvent.click(elNonCurTab);

      expect(screen.queryByRole('textbox', { name: /^name$/i })).not.toBeInTheDocument();
    })
    it('should not display the Name input field, when clicking the current tab ane edit mode is off', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB], currentWorkflowId: idWB})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: 'Workflow 1'})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: 'Workflow 2'})}),
          }
        },
        ui: {
          editMode: false,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      const elCurTab = screen.getAllByRole('tab')[1];

      fireEvent.click(elCurTab);

      expect(screen.queryByRole('textbox', { name: /^name$/i })).not.toBeInTheDocument();
    })
    it('should display and focus the Name input field with a value=name, when clicking the current tab ane edit mode is on', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB], currentWorkflowId: idWB})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: 'Workflow 1'})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: 'Workflow 2'})}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      const elCurTab = screen.getAllByRole('tab')[1];

      fireEvent.click(elCurTab);

      const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: /^name$/i });
      expect(elCurTab.parentElement).toContainElement(nameInput);
      expect(nameInput).toHaveValue('Workflow 2');
      expect(nameInput).toHaveFocus();
    })

    it('should remove the Name input field, when it loses focus', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Workflow/i
      }));

      act(()=> {
        screen.getByRole('textbox', { name: /^name$/i }).blur();
      })
      expect(screen.queryByRole('textbox', { name: /^name$/i })).not.toBeInTheDocument();
    })

    it('should remove the Name input field, when the user presses Enter', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Workflow/i
      }));

      fireEvent.keyDown(screen.getByRole('textbox', { name: /^name$/i }), {key: 'Enter', code: 'Enter', charCode: 13})

      expect(screen.queryByRole('textbox', { name: /^name$/i })).not.toBeInTheDocument();
    })

    it('should not remove the Name input field, when the user presses non-Enter', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Workflow/i
      }));

      fireEvent.keyDown(screen.getByRole('textbox', { name: /^name$/i }), {key: 'A', code: 'KeyA'})

      expect(screen.queryByRole('textbox', { name: /^name$/i })).toBeInTheDocument();
    })

    it('should call the rename workflow usecase with right params, when typing into Name input field', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      const addToName = '!';
      const {renameWorkflowUseCase} = await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: 'Workflow 1'})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: 'Workflow 2'})}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add Workflow/i
      }));

      const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: /^name$/i });

      await userEvent.type(nameInput, addToName);

      expect(renameWorkflowUseCase).toBeCalledTimes(1);
      expect(renameWorkflowUseCase).toBeCalledWith(newWorkflowId, 'Workflow 3' + addToName)
    })


    it('should display 0 tabs, when there are 0 workflows', async () => {
      const id='P-A';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id, workflowIds: []})
          }
        },
        ui: {
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [id],
            currentProjectId: id
          })
        }
      }));
      expect(screen.queryAllByRole('tab').length).toBe(0);
    });

    it('should display 2 tabs, when there are 2 workflows', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      expect(screen.getAllByRole('tab').length).toBe(2);
    });

    it('should display workflow names on the tabs', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const nameWA = 'Workflow A';
      const nameWB = 'Workflow B';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA({name: nameWA})}),
            ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB({name: nameWB})}),
          }
        },
        ui: {
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));
      expect(screen.getByText(nameWA)).toBeInTheDocument();
      expect(screen.getByText(nameWB)).toBeInTheDocument();
    });

    it('should display an action bar on the tabs', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA()}),
              ...fixtureWorkflowBInColl({id: idWB, settings: fixtureWorkflowSettingsB()}),
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        })
      );

      expect(screen.getAllByRole('button', {name: 'Workflow Settings'}).length).toBe(2);
    })

    it('should display edit-mode actions on a tab, when edit mode is on', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA()}),
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        })
      );

      expect(screen.queryAllByRole('button', {name: /workflow settings/i}).length).toBe(1);
      expect(screen.queryAllByRole('button', {name: /delete workflow/i}).length).toBe(1);
    })

    it('should not display edit-mode actions on a tab, when edit mode is off', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA()}),
            }
          },
          ui: {
            editMode: false,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        })
      );

      expect(screen.queryAllByRole('button', {name: /workflow settings/i}).length).toBe(0);
      expect(screen.queryAllByRole('button', {name: /delete workflow/i}).length).toBe(0);
    })

    it('should call the open settings usecase with right params, when clicking the Workflow Settings button', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const {openWorkflowSettingsUseCase} = await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA()}),
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        })
      );

      const elButton = screen.getByRole('button', {name: /workflow settings/i});
      fireEvent.click(elButton);

      expect(openWorkflowSettingsUseCase).toBeCalledTimes(1);
      expect(openWorkflowSettingsUseCase).toBeCalledWith(idWA);
    })

    it('should call the delete workflow usecase with right params, when clicking the Delete Workflow button', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const {deleteWorkflowUseCase} = await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA, settings: fixtureWorkflowSettingsA()}),
            }
          },
          ui: {
            editMode: true,
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        })
      );

      const elButton = screen.getByRole('button', {name: /delete workflow/i});
      fireEvent.click(elButton);

      expect(deleteWorkflowUseCase).toBeCalledTimes(1);
      expect(deleteWorkflowUseCase).toBeCalledWith(idWA);
    })

    it('should set "aria-selected=true" for the current workflow tab', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB], currentWorkflowId: idWB})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'false');
      expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('should make tabs draggable, when edit mode is on', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      const {comp} = await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: true,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));

      expect(comp.container.querySelectorAll('[draggable="true"]').length).toBe(2);
      const items = screen.getAllByRole('tab');
      expect(items[0]).toHaveAttribute('draggable', 'true');
      expect(items[1]).toHaveAttribute('draggable', 'true');
    });

    it('should not make tabs draggable, when edit mode is off', async () => {
      const idP = 'P';
      const idWA = 'W-A';
      const idWB = 'W-B';
      const {comp} = await setup(fixtureAppState({
        entities: {
          projects: {
            ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
          },
          workflows: {
            ...fixtureWorkflowAInColl({id: idWA}),
            ...fixtureWorkflowBInColl({id: idWB}),
          }
        },
        ui: {
          editMode: false,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [idP],
            currentProjectId: idP
          })
        }
      }));
      expect(comp.container.querySelectorAll('[draggable="false"]').length).toBe(2);
    });

    it('should not add "dont-show-action-bar" class name to the tablist, when not dragging nor resizing', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            }),
            dragDrop: fixtureDragDropNotDragging(),
            worktable: fixtureWorktableNotResizing()
          }
        }),
      );
      expect(screen.getByRole('tablist')).not.toHaveClass('dont-show-action-bar');
    })

    it('should add "dont-show-action-bar" class name to the tablist, when dragging', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            }),
            dragDrop: {
              from: {}
            },
            worktable: fixtureWorktableNotResizing()
          }
        }),
      )
      expect(screen.getByRole('tablist')).toHaveClass('dont-show-action-bar');
    })

    it('should add "dont-show-action-bar" class name to the tablist, when resizing item in the worktable', async () => {
      const id = 'P-A';
      await setup(
        fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id})
            }
          },
          ui: {
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [id],
              currentProjectId: id
            }),
            dragDrop: fixtureDragDropNotDragging(),
            worktable: fixtureWorktableResizingItem()
          }
        }),
      );
      expect(screen.getByRole('tablist')).toHaveClass('dont-show-action-bar');
    })

    describe('when not dragging tab', () => {
    //   it('should display tabs without "is-dragging" style', async () => {
    //     const workflowA = fixtureWorkflowA();
    //     const workflowB = fixtureWorkflowB();
    //     const projectA = {
    //       ...fixtureProjectA(),
    //       workflowIds: [workflowA.id, workflowB.id]
    //     }
    //     const {comp} = await setup({
    //       projectsState: {
    //         entities: {
    //           [projectA.id]: projectA
    //         }
    //       },
    //       workflowsState: {
    //         entities: {
    //           [workflowA.id]: workflowA,
    //           [workflowB.id]: workflowB
    //         }
    //       },
    //       projectSwitcherState: {
    //         projectIds: [projectA.id],
    //         currentProjectId: projectA.id
    //       }
    //     });

    //     expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(0);
    //   });

      it('should not display Workflow Switcher as a drop target', async () => {
        const idP = 'P';
        const idW = 'W';
          await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idW]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idW}),
            }
            },
          ui: {
            dragDrop: fixtureDragDropNotDragging(),
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        const elOver = screen.getByRole('tablist');
        expect(elOver).not.toHaveClass(classIsDropArea);
      });

      it('should not display Workflow Switcher tabs as a drop target', async () => {
        const idP = 'P';
        const idWA = 'W-A';
        const idWB = 'W-B';
        const {comp} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA}),
              ...fixtureWorkflowBInColl({id: idWB}),
            }
          },
          ui: {
            dragDrop: fixtureDragDropNotDragging(),
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
      });
    });

    describe('when dragging tab from Workflow Switcher', () => {
      // it('should display a dragged tab with "is-dragging" style', async () => {
      //   const workflowA = fixtureWorkflowA();
      //   const workflowB = fixtureWorkflowB({
      //     id: dragItemId
      //   });
      //   const projectA = {
      //     ...fixtureProjectA(),
      //     workflowIds: [workflowA.id, workflowB.id]
      //   }
      //   const {comp} = await setup({
      //     dragDropState: {
      //       ...fixtureDragDropStateDraggingItemFromWorkflowSwitcher(),
      //       from: {
      //         workflowSwitcher: {
      //           projectId: projectA.id,
      //           workflowId: dragItemId
      //         }
      //       }
      //     },
      //     projectsState: {
      //       entities: {
      //         [projectA.id]: projectA
      //       }
      //     },
      //     workflowsState: {
      //       entities: {
      //         [workflowA.id]: workflowA,
      //         [workflowB.id]: workflowB
      //       }
      //     },
      //     projectSwitcherState: {
      //       projectIds: [projectA.id],
      //       currentProjectId: projectA.id
      //     }
      //   });

      //   const elDrag = screen.getAllByRole('tab')[1];

      //   expect(comp.container.getElementsByClassName(classIsDragging).length).toBe(1);
      //   expect(elDrag).toHaveClass(classIsDragging);
      // });

      it('should set "is-drop-area" style to Workflow Switcher, when dragging over it and edit mode is on', async () => {
        const idP = 'P';
        const idWA = 'W-A';
        const idWB = 'W-B';
        const {comp} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA}),
              ...fixtureWorkflowBInColl({id: idWB}),
            }
          },
          ui: {
            editMode: true,
            dragDrop: {
              ...fixtureDragDropFromWorkflowSwitcher(),
              ...fixtureDragDropOverWorkflowSwitcher({workflowId: null})
            },
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(1);
        const elOver = screen.getByRole('tablist');
        expect(elOver).toHaveClass(classIsDropArea);
      });

      it('should not set "is-drop-area" style to Workflow Switcher, when dragging over it and edit mode is off', async () => {
        const idP = 'P';
        const idWA = 'W-A';
        const idWB = 'W-B';
        const {comp} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idWA}),
              ...fixtureWorkflowBInColl({id: idWB}),
            }
          },
          ui: {
            editMode: false,
            dragDrop: {
              ...fixtureDragDropFromWorkflowSwitcher(),
              ...fixtureDragDropOverWorkflowSwitcher({workflowId: null})
            },
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
      });

      it('should set "is-drop-area" style to Workflow Switcher tab, when dragging over it and edit mode is on', async () => {
        const idP = 'P';
        const idW = 'W';
        const {comp} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idW, overItemId]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idW}),
              ...fixtureWorkflowBInColl({id: overItemId}),
            }
          },
          ui: {
            editMode: true,
            dragDrop: {
              ...fixtureDragDropFromWorkflowSwitcher(),
              ...fixtureDragDropOverWorkflowSwitcher({workflowId: overItemId})
            },
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(1);
        const elOver = screen.getAllByRole('tab')[1];
        expect(elOver).toHaveClass(classIsDropArea);
      });

      it('should not set "is-drop-area" style to Workflow Switcher tab, when dragging over it and edit mode is off', async () => {
        const idP = 'P';
        const idW = 'W';
        const {comp} = await setup(fixtureAppState({
          entities: {
            projects: {
              ...fixtureProjectAInColl({id: idP, workflowIds: [idW, overItemId]})
            },
            workflows: {
              ...fixtureWorkflowAInColl({id: idW}),
              ...fixtureWorkflowBInColl({id: overItemId}),
            }
          },
          ui: {
            editMode: false,
            dragDrop: {
              ...fixtureDragDropFromWorkflowSwitcher(),
              ...fixtureDragDropOverWorkflowSwitcher({workflowId: overItemId})
            },
            projectSwitcher: fixtureProjectSwitcher({
              projectIds: [idP],
              currentProjectId: idP
            })
          }
        }));

        expect(comp.container.getElementsByClassName(classIsDropArea).length).toBe(0);
      });
    });
  })



  it('should call the switchWorkflow use case with right params, when clicking a tab', async () => {
    const idP = 'P';
    const idWA = 'W-A';
    const idWB = 'W-B';
    const {
      switchWorkflowUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB], currentWorkflowId: idWB})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idWA}),
          ...fixtureWorkflowBInColl({id: idWB}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));
    const elSelected = screen.getAllByRole('tab')[0];

    fireEvent.click(elSelected);

    expect(switchWorkflowUseCase).toBeCalledTimes(1);
    expect(switchWorkflowUseCase).toBeCalledWith(idP, idWA);
  });

  it('should call a drag use case with right params, when start dragging a tab and edit mode is on', async () => {
    const idP = 'P';
    const idW = 'W-A';
    const {
      dragWorkflowFromWorkflowSwitcherUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idW, dragItemId]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idW}),
          ...fixtureWorkflowBInColl({id: dragItemId}),
        }
      },
      ui: {
        editMode: true,
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elDrag = screen.getAllByRole('tab')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWorkflowFromWorkflowSwitcherUseCase).toBeCalledTimes(1);
    expect(dragWorkflowFromWorkflowSwitcherUseCase).toBeCalledWith(idP, dragItemId);
  });

  it('should not call a drag use case , when start dragging a tab and edit mode is off', async () => {
    const idP = 'P';
    const idW = 'W-A';
    const {
      dragWorkflowFromWorkflowSwitcherUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idW, dragItemId]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idW}),
          ...fixtureWorkflowBInColl({id: dragItemId}),
        }
      },
      ui: {
        editMode: false,
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elDrag = screen.getAllByRole('tab')[1];

    fireEvent.dragStart(elDrag);

    expect(dragWorkflowFromWorkflowSwitcherUseCase).not.toBeCalled();
  });

  it('should call a drag over/leave use case with right params, when dragging an item in/over/out Workflow Switcher', async () => {
    const idP = 'P';
    const idWA = 'W-A';
    const idWB = 'W-B';
    const {
      dragOverWorkflowSwitcherUseCase,
      dragLeaveTargetUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idWA}),
          ...fixtureWorkflowBInColl({id: idWB}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elOver = screen.getByRole('tablist');

    fireEvent.dragEnter(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(0);
    expect(dragOverWorkflowSwitcherUseCase).toBeCalledTimes(1);

    fireEvent.dragOver(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(0);
    expect(dragOverWorkflowSwitcherUseCase).toBeCalledTimes(2);

    fireEvent.dragLeave(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(1);
    expect(dragOverWorkflowSwitcherUseCase).toBeCalledTimes(2);

    expect(dragLeaveTargetUseCase).toBeCalledWith();
    expect(dragOverWorkflowSwitcherUseCase.mock.calls).toEqual([
      [null],
      [null]
    ]);
  });

  it('should call a drag over/leave use case with right params, when dragging an item in/over/out Workflow Switcher tab', async () => {
    const idP = 'P';
    const idW = 'W';
    const {
      dragOverWorkflowSwitcherUseCase,
      dragLeaveTargetUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idW, overItemId]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idW}),
          ...fixtureWorkflowBInColl({id: overItemId}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elOver = screen.getAllByRole('tab')[1];

    fireEvent.dragEnter(elOver);
    expect(dragOverWorkflowSwitcherUseCase).toBeCalledTimes(1);

    fireEvent.dragOver(elOver);
    expect(dragOverWorkflowSwitcherUseCase).toBeCalledTimes(2);

    fireEvent.dragLeave(elOver);
    expect(dragLeaveTargetUseCase).toBeCalledTimes(1);

    expect(dragOverWorkflowSwitcherUseCase.mock.calls).toEqual([
      [overItemId],
      [overItemId]
    ]);
    expect(dragLeaveTargetUseCase).toBeCalledWith();
  });

  it('should call a drag end use case with right params, when end dragging a tab', async () => {
    const idP = 'P';
    const idWA = 'W-A';
    const idWB = 'W-B';
    const {
      dragEndUseCase,
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idWA}),
          ...fixtureWorkflowBInColl({id: idWB}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));
    const elDrag = screen.getAllByRole('tab')[1];

    fireEvent.dragEnd(elDrag);

    expect(dragEndUseCase).toBeCalledTimes(1);
    expect(dragEndUseCase).toBeCalledWith();
  });

  it('should call a drop use case with right params, when dropping an item over Workflow Switcher', async () => {
    const idP = 'P';
    const idWA = 'W-A';
    const idWB = 'W-B';
    const {
      dropOnWorkflowSwitcherUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idWA, idWB]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idWA}),
          ...fixtureWorkflowBInColl({id: idWB}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elOver = screen.getByRole('tablist');

    fireEvent.drop(elOver);
    expect(dropOnWorkflowSwitcherUseCase).toBeCalledTimes(1);
    expect(dropOnWorkflowSwitcherUseCase).toBeCalledWith(idP, null);
  });

  it('should call a drop use case with right params, when dropping an item over Workflow Switcher tab', async () => {
    const idP = 'P';
    const idW = 'W';
    const {
      dropOnWorkflowSwitcherUseCase
    } = await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: idP, workflowIds: [idW, overItemId]})
        },
        workflows: {
          ...fixtureWorkflowAInColl({id: idW}),
          ...fixtureWorkflowBInColl({id: overItemId}),
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [idP],
          currentProjectId: idP
        })
      }
    }));

    const elOver = screen.getAllByRole('tab')[1];

    fireEvent.drop(elOver);
    expect(dropOnWorkflowSwitcherUseCase).toBeCalledTimes(1);
    expect(dropOnWorkflowSwitcherUseCase).toBeCalledWith(idP, overItemId);
  });
})
