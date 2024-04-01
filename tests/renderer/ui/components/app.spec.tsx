/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen, within } from '@testing-library/react';
import { createAppComponent } from '@/ui/components/app/app';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { createAppViewModelHook } from '@/ui/components/app/appViewModel';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { ModalScreenId } from '@/base/state/ui';
import { fixtureModalScreens } from '@tests/base/state/fixtures/modalScreens';

const strTopBar = 'TopBar';
const strWidgetSettings = 'WidgetSettings';
const strWorkflowSettings = 'WorkflowSettings';
const strWorkflowSwitcher = 'WorkflowSwitcher';
const strProjectManager = 'ProjectManager';
const strApplicationSettings = 'ApplicationSettings';
const strWorktable = 'Worktable';
const strAbout = 'About';
const mockTopBar = () => <div>{strTopBar}</div>;
const mockWidgetSettings = () => <div>{strWidgetSettings}</div>;
const mockWorkflowSettings = () => <div>{strWorkflowSettings}</div>;
const mockProjectManager = () => <div>{strProjectManager}</div>;
const mockApplicationSettings = () => <div>{strApplicationSettings}</div>;
const mockAbout = () => <div>{strAbout}</div>;
const mockWorkflowSwitcher = () => <div>{strWorkflowSwitcher}</div>;
const mockWorktable = () => <div>{strWorktable}</div>;

async function setup(
  appState: AppState,
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const showContextMenuUseCase = jest.fn();

  const useAppViewModel = createAppViewModelHook({
    useAppState,
    WidgetSettings: mockWidgetSettings,
    WorkflowSettings: mockWorkflowSettings,
    ProjectManager: mockProjectManager,
    ApplicationSettings: mockApplicationSettings,
    About: mockAbout,
    showContextMenuUseCase
  });

  const App = createAppComponent({
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
    showContextMenuUseCase
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

  describe.each<{name: string, modalScreen: ModalScreenId | undefined, expectRendered: string}>([
    {name: 'no modal screens', modalScreen: undefined, expectRendered: ''},
    {name: 'WidgetSettings', modalScreen: 'widgetSettings', expectRendered: strWidgetSettings},
    {name: 'WorkflowSettings', modalScreen: 'workflowSettings', expectRendered: strWorkflowSettings},
    {name: 'ProjectManager', modalScreen: 'projectManager', expectRendered: strProjectManager},
    {name: 'ApplicationSettings', modalScreen: 'applicationSettings', expectRendered: strApplicationSettings},
    {name: 'About', modalScreen: 'about', expectRendered: strAbout},
  ])('When modal screens state = $name', ({modalScreen, expectRendered}) => {
    beforeEach(async ()=> {
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            order: modalScreen ? [modalScreen] : []
          })
        }
      }));
    })

    if (expectRendered===strWidgetSettings) {
      it('should display WidgetSettings', async () => {
        expect(screen.getByText(strWidgetSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display WidgetSettings', async () => {
        expect(screen.queryByText(strWidgetSettings)).not.toBeInTheDocument();
      });
    }

    if (expectRendered===strWorkflowSettings) {
      it('should display WorkflowSettings', async () => {
        expect(screen.getByText(strWorkflowSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display WorkflowSettings', async () => {
        expect(screen.queryByText(strWorkflowSettings)).not.toBeInTheDocument();
      });
    }

    if (expectRendered===strProjectManager) {
      it('should display ProjectManager', async () => {
        expect(screen.getByText(strProjectManager)).toBeInTheDocument();
      });
    } else {
      it('should not display ProjectManager', async () => {
        expect(screen.queryByText(strProjectManager)).not.toBeInTheDocument();
      });
    }

    if (expectRendered===strApplicationSettings) {
      it('should display ApplicationSettings', async () => {
        expect(screen.getByText(strApplicationSettings)).toBeInTheDocument();
      });
    } else {
      it('should not display ApplicationSettings', async () => {
        expect(screen.queryByText(strApplicationSettings)).not.toBeInTheDocument();
      });
    }

    if (expectRendered===strAbout) {
      it('should display About', async () => {
        expect(screen.getByText(strAbout)).toBeInTheDocument();
      });
    } else {
      it('should not display About', async () => {
        expect(screen.queryByText(strAbout)).not.toBeInTheDocument();
      });
    }

    if (modalScreen) {
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

  describe('when modal screens state = multiple screens', () => {
    beforeEach(async ()=> {
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            order: ['projectManager', 'applicationSettings', 'about']
          })
        }
      }));
    })

    it('should render all the modal screen components in the right order', () => {
      const modals = screen.queryAllByTestId('modal-screen');
      expect(modals.length).toBe(3);
      expect(within(modals[0]).getByText(strProjectManager)).toBeInTheDocument()
      expect(within(modals[1]).getByText(strApplicationSettings)).toBeInTheDocument()
      expect(within(modals[2]).getByText(strAbout)).toBeInTheDocument()
    })

    it('should make all the screens inert, excepting the last one', () => {
      const modals = screen.queryAllByTestId('modal-screen');
      expect(modals[0]).toHaveAttribute('inert');
      expect(modals[1]).toHaveAttribute('inert');
      expect(modals[2]).not.toHaveAttribute('inert');
    })
  })

});
