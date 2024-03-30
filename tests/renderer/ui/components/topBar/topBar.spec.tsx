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
  it('should display EditModeToggle', async() => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strEditModeToggle)).toBeInTheDocument();
  });
  it('should display ProjectSwitcher', async() => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strProjectSwitcher)).toBeInTheDocument();
  });
  it('should display ManageProjectsButton', async() => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strManageProjectsButton)).toBeInTheDocument();
  });
  it('should display Shelf', async() => {
    await setup(fixtureAppState({}));
    expect(screen.getByText(strShelf)).toBeInTheDocument();
  });

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
