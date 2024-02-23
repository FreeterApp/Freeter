/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createAppComponent } from '@/ui/components/app/app';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { createAppViewModelHook } from '@/ui/components/app/appViewModel';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl, fixtureWorkflowAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';

const strPalette = 'Palette';
const strTopBar = 'TopBar';
const strWidgetSettings = 'WidgetSettings';
const strWorkflowSettings = 'WorkflowSettings';
const strWorkflowSwitcher = 'WorkflowSwitcher';
const strProjectManager = 'ProjectManager';
const strApplicationSettings = 'ApplicationSettings';
const strWorktable = 'Worktable';
const strAbout = 'About';
const mockPalette = () => <div>{strPalette}</div>;
const mockTopBar = () => <div>{strTopBar}</div>;
const mockWidgetSettings = (isRendered: boolean) => isRendered ? () => <div>{strWidgetSettings}</div> : () => null;
const mockWorkflowSettings = (isRendered: boolean) => isRendered ? () => <div>{strWorkflowSettings}</div> : () => null;
const mockProjectManager = (isRendered: boolean) => isRendered ? () => <div>{strProjectManager}</div> : () => null;
const mockApplicationSettings = (isRendered: boolean) => isRendered ? () => <div>{strApplicationSettings}</div> : () => null;
const mockAbout = (isRendered: boolean) => isRendered ? () => <div>{strAbout}</div> : () => null;
const mockWorkflowSwitcher = () => <div>{strWorkflowSwitcher}</div>;
const mockWorktable = () => <div>{strWorktable}</div>;

interface SetupOpts {
  widgetSettingsIsRendered?: boolean,
  workflowSettingsIsRendered?: boolean,
  projectManagerIsRendererd?: boolean;
  applicationSettingsIsRendered?: boolean;
  aboutIsRendered?: boolean;
}
async function setup(
  appState: AppState,
  opts?: SetupOpts
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const showContextMenuForTextInputUseCase = jest.fn();

  const useAppViewModel = createAppViewModelHook({
    useAppState,
    WidgetSettings: mockWidgetSettings(!!opts?.widgetSettingsIsRendered),
    WorkflowSettings: mockWorkflowSettings(!!opts?.workflowSettingsIsRendered),
    ProjectManager: mockProjectManager(!!opts?.projectManagerIsRendererd),
    ApplicationSettings: mockApplicationSettings(!!opts?.applicationSettingsIsRendered),
    About: mockAbout(!!opts?.aboutIsRendered),
    showContextMenuForTextInputUseCase
  });

  const App = createAppComponent({
    Palette: mockPalette,
    TopBar: mockTopBar,
    WorkflowSwitcher: mockWorkflowSwitcher,
    Worktable: mockWorktable,
    useAppViewModel,
  })
  const comp = render(
    <App/>
  );

  return {
    comp,
    appStore,
    showContextMenuForTextInputUseCase
  }
}

describe('<App />', () => {
  it('should display TopBar', async () => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strTopBar)).toBeInTheDocument();
  });

  it('should not display "No Projects" text, when there are projects in the project switcher', async () => {
    const projectId = 'PROJECT-ID';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId})
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId]
        })
      }
    }));
    expect(screen.queryByText(/You don't have any projects/i)).not.toBeInTheDocument();
  });

  it('should display "No Projects" text, when there are not projects in the project switcher', async () => {
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl()
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: ['NO-SUCH-ID']
        })
      }
    }));
    expect(screen.getByText(/You don't have any projects/i)).toBeInTheDocument();
  });

  it('should display Workflow Switcher, when there are projects in the project switcher', async () => {
    const projectId = 'PROJECT-ID';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId})
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId]
        })
      }
    }));
    expect(screen.getByText(strWorkflowSwitcher)).toBeInTheDocument();
  });

  it('should not display Workflow Switcher, when there are no projects in the project switcher', async () => {
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl()
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: ['NO-SUCH-ID']
        })
      }
    }));
    expect(screen.queryByText(strWorkflowSwitcher)).not.toBeInTheDocument();
  });

  it('should display Worktable, when there are projects', async () => {
    const projectId = 'PROJECT-ID';
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId})
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: [projectId]
        })
      }
    }));
    expect(screen.getByText(strWorktable)).toBeInTheDocument();
  });

  it('should not display Worktable, when there are no projects in the project switcher', async () => {
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl()
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          projectIds: ['NO-SUCH-ID']
        })
      }
    }));
    expect(screen.queryByText(strWorktable)).not.toBeInTheDocument();
  });

  describe.each<{name: string, opts: SetupOpts}>([
    {name: 'no modal screen components rendered', opts: {widgetSettingsIsRendered: false, workflowSettingsIsRendered: false, projectManagerIsRendererd: false, applicationSettingsIsRendered: false, aboutIsRendered: false}},
    {name: '<WidgetSettings> is rendered', opts: {widgetSettingsIsRendered: true, workflowSettingsIsRendered: false, projectManagerIsRendererd: false, applicationSettingsIsRendered: false, aboutIsRendered: false}},
    {name: '<WorkflowSettings> is rendered', opts: {widgetSettingsIsRendered: false, workflowSettingsIsRendered: true, projectManagerIsRendererd: false, applicationSettingsIsRendered: false, aboutIsRendered: false}},
    {name: '<ProjectManager> is rendered', opts: {widgetSettingsIsRendered: false, workflowSettingsIsRendered: false, projectManagerIsRendererd: true, applicationSettingsIsRendered: false, aboutIsRendered: false}},
    {name: '<ApplicationSettings> is rendered', opts: {widgetSettingsIsRendered: false, workflowSettingsIsRendered: false, projectManagerIsRendererd: false, applicationSettingsIsRendered: true, aboutIsRendered: false}},
    {name: '<About> is rendered', opts: {widgetSettingsIsRendered: false, workflowSettingsIsRendered: false, projectManagerIsRendererd: false, applicationSettingsIsRendered: false, aboutIsRendered: true}},
  ])('When $name', ({opts}) => {
    beforeEach(async ()=> {
      await setup(fixtureAppState({}), opts);
    })

    const {widgetSettingsIsRendered, workflowSettingsIsRendered, projectManagerIsRendererd, applicationSettingsIsRendered, aboutIsRendered} = opts;

    if (widgetSettingsIsRendered) {
      it('should display WidgetSettings', async () => {
        expect(screen.getByText(strWidgetSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display WidgetSettings', async () => {
        expect(screen.queryByText(strWidgetSettings)).not.toBeInTheDocument();
      });
    }

    if (workflowSettingsIsRendered) {
      it('should display WorkflowSettings', async () => {
        expect(screen.getByText(strWorkflowSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display WorkflowSettings', async () => {
        expect(screen.queryByText(strWorkflowSettings)).not.toBeInTheDocument();
      });
    }

    if (projectManagerIsRendererd) {
      it('should display ProjectManager', async () => {
        expect(screen.getByText(strProjectManager)).toBeInTheDocument();
      });
    } else {
      it('should not display ProjectManager', async () => {
        expect(screen.queryByText(strProjectManager)).not.toBeInTheDocument();
      });
    }

    if (applicationSettingsIsRendered) {
      it('should display ApplicationSettings', async () => {
        expect(screen.getByText(strApplicationSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display ApplicationSettings', async () => {
        expect(screen.queryByText(strApplicationSettings)).not.toBeInTheDocument();
      });
    }

    if (aboutIsRendered) {
      it('should display About', async () => {
        expect(screen.getByText(strAbout)).toBeInTheDocument();
      });
    } else {
      it('should not display About', async () => {
        expect(screen.queryByText(strAbout)).not.toBeInTheDocument();
      });
    }

    if (widgetSettingsIsRendered || workflowSettingsIsRendered || projectManagerIsRendererd || applicationSettingsIsRendered || aboutIsRendered) {
      it('should make the main screen inert, and show the modal screen area', async () => {
        expect(screen.getByTestId('main-screen')).toHaveAttribute('inert');
        expect(screen.getByTestId('modal-screen')).toBeInTheDocument();
      })
    } else {
      it('should not make the main screen inert, nor show the modal screen area', async () => {
        expect(screen.getByTestId('main-screen')).not.toHaveAttribute('inert');
        expect(screen.queryByTestId('modal-screen')).not.toBeInTheDocument();
      })
    }
  })

  describe('when edit mode is on', () => {
    it('should display Palette, when the current project and the current workflow exist', async () => {
      const workflowId = 'workflow-id';
      const projectId = 'project-id';
      await setup(fixtureAppState({
        entities: {
          projects: fixtureProjectAInColl({id: projectId, workflowIds: [workflowId], currentWorkflowId: workflowId}),
          workflows: fixtureWorkflowAInColl({id: workflowId})
        },
        ui: {
          editMode: true,
          projectSwitcher: {
            projectIds: [projectId],
            currentProjectId: projectId
          }
        }
      }));
      expect(screen.getByText(strPalette)).toBeInTheDocument();
    });

    it('should not display Palette, when there are no projects', async () => {
      await setup(fixtureAppState({
        entities: {
          projects: {},
          workflows: fixtureWorkflowAInColl()
        },
        ui: {
          editMode: true,
          projectSwitcher: {
            projectIds: [],
            currentProjectId: ''
          }
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
          projectSwitcher: {
            projectIds: [projectId],
            currentProjectId: projectId
          }
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
          projectSwitcher: {
            projectIds: ['no such id'],
            currentProjectId: 'no such id'
          }
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
          projectSwitcher: {
            projectIds: [projectId],
            currentProjectId: projectId
          }
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
          projectSwitcher: {
            projectIds: [projectId],
            currentProjectId: projectId
          }
        }
      }));
      expect(screen.queryByText(strPalette)).not.toBeInTheDocument();
    });
  })

});
