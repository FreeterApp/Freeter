/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createTopBarComponent } from '@/ui/components/topBar/topBar';
import { AppState } from '@/base/state/app';
import { createTopBarViewModelHook } from '@/ui/components/topBar/topBarViewModel';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { EditTogglePos, ProjectSwitcherPos } from '@/base/state/ui';

const strEditModeToggle = 'Edit Mode Toggle';
const strProjectSwitcher = 'Project Switcher';
const strManageProjectsButton = 'Manage Projects Button';
const strPalette = 'Palette';
const strShelf = 'Shelf';
const mockEditModeToggle = () => <div>{strEditModeToggle}</div>;
const mockProjectSwitcher = () => <div>{strProjectSwitcher}</div>;
const mockManageProjectsButton = () => <div>{strManageProjectsButton}</div>
const mockPalette = () => <div>{strPalette}</div>;
const mockShelf = () => <div>{strShelf}</div>;

async function setup(
  appState: AppState,
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const useTopBarViewModel = createTopBarViewModelHook({
    useAppState,
  });

  const TopBar = createTopBarComponent({
    EditModeToggle: mockEditModeToggle,
    ProjectSwitcher: mockProjectSwitcher,
    ManageProjectsButton: mockManageProjectsButton,
    Palette: mockPalette,
    Shelf: mockShelf,
    useTopBarViewModel,
  })
  const comp = render(
    <TopBar/>
  );

  return {
    appStore,
    comp
  }
}

describe('<TopBar />', () => {
  it('should not display EditModeToggle, when its pos!==TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        editTogglePos: EditTogglePos.TabBarLeft
      }
    }));
    expect(screen.queryByText(strEditModeToggle)).not.toBeInTheDocument();
  });
  it('should display EditModeToggle, when its pos===TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        editTogglePos: EditTogglePos.TopBar
      }
    }));
    expect(screen.getByText(strEditModeToggle)).toBeInTheDocument();
  });
  it('should not display ProjectSwitcher, when its pos!==TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          pos: ProjectSwitcherPos.TabBarLeft
        })
      }
    }));
    expect(screen.queryByText(strProjectSwitcher)).not.toBeInTheDocument();
  });
  it('should display ProjectSwitcher, when its pos===TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          pos: ProjectSwitcherPos.TopBar
        })
      }
    }));
    expect(screen.getByText(strProjectSwitcher)).toBeInTheDocument();
  });
  it('should not display ManageProjectsButton, when its pos!==TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          pos: ProjectSwitcherPos.TabBarLeft
        })
      }
    }));
    expect(screen.queryByText(strManageProjectsButton)).not.toBeInTheDocument();
  });
  it('should display ManageProjectsButton, when its pos===TopBar', async() => {
    await setup(fixtureAppState({
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          pos: ProjectSwitcherPos.TopBar
        })
      }
    }));
    expect(screen.getByText(strManageProjectsButton)).toBeInTheDocument();
  });
  it('should display Shelf', async() => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strShelf)).toBeInTheDocument();
  });

  describe('when edit mode is on', () => {
    it('should display Palette, when its pos===TopBar, the current project and the current workflow exist', async () => {
      const workflowId = 'workflow-id';
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: [workflowId], currentWorkflowId: workflowId}),
          workflows: fixtureWorkflowAInColl({id: workflowId})
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [projectId],
            currentProjectId: projectId
          })
        }
      }));
      expect(screen.getByText(strPalette)).toBeInTheDocument();
    });

    it('should not display Palette, when its pos!==TopBar, the current project and the current workflow exist', async () => {
      const workflowId = 'workflow-id';
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: [workflowId], currentWorkflowId: workflowId}),
          workflows: fixtureWorkflowAInColl({id: workflowId})
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TabBarLeft,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [projectId],
            currentProjectId: projectId
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });

    it('should not display Palette, when there are no projects', async () => {
      await setup(fixtureAppState({
        entities: {
          projects: {},
          workflows: fixtureWorkflowAInColl()
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [],
            currentProjectId: ''
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });

    it('should not display Palette, when there are no workflows', async () => {
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: [], currentWorkflowId: ''}),
          workflows: {}
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [projectId],
            currentProjectId: projectId
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });

    it('should not display Palette, when the current project does not exist', async () => {
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl(),
          workflows: fixtureWorkflowAInColl()
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: ['no such id'],
            currentProjectId: 'no such id'
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });

    it('should not display Palette, when the current workflow does not exist', async () => {
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: ['no-such-id'], currentWorkflowId: 'no-such-id'}),
          workflows: fixtureWorkflowAInColl()
        },
        ui: {
          editMode: true,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [projectId],
            currentProjectId: projectId
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });
  })

  describe('when edit mode is off', () => {
    it('should not display Palette', async () => {
      const workflowId = 'workflow-id';
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: [workflowId], currentWorkflowId: workflowId}),
          workflows: fixtureWorkflowAInColl({id: workflowId})
        },
        ui: {
          editMode: false,
          editTogglePos: EditTogglePos.TopBar,
          projectSwitcher: fixtureProjectSwitcher({
            projectIds: [projectId],
            currentProjectId: projectId
          })
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });
  })
});
