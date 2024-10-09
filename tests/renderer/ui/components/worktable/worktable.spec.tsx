/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { createWorktableComponent } from '@/ui/components/worktable/worktable';
import { createWorktableViewModelHook } from '@/ui/components/worktable/worktableViewModel';
import { AppState } from '@/base/state/app';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';
import { fixtureProjectAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureWorkflowA, fixtureWorkflowB, fixtureWorkflowC } from '@tests/base/fixtures/workflow';
import { WidgetLayoutProps } from '@/ui/components/worktable/widgetLayout';
import { fixtureMemSaver } from '@tests/base/state/fixtures/memSaver';

const strWidgetLayout = 'WidgetLayout';
const projectId = 'PROJECT-ID';
const strIsVisible = 'IS-VISIBLE'

const WidgetLayout = (props: WidgetLayoutProps) => <div>{strWidgetLayout} {props.projectId} {props.workflowId} {props.isVisible && strIsVisible}</div>;

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const useWorktableViewModel = createWorktableViewModelHook({useAppState})
  const Worktable = createWorktableComponent({
    useWorktableViewModel,
    WidgetLayout
  })
  const comp = render(
    <Worktable/>
  );

  return {
    comp,
    appStore,
  }
}

describe('<Worktable />', () => {
  it('should not display "No Workflows" text, when there are workflows active in mem saver', async () => {
    const workflowA = fixtureWorkflowA();
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: [workflowA.id]})
        },
        workflows: {
          [workflowA.id]: workflowA,
        }
      },
      ui: {
        editMode: false,
        memSaver: fixtureMemSaver({
          activeWorkflowIds: [workflowA.id]
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      }
    }));
    expect(screen.queryByText(/The project does not have any workflows/i)).not.toBeInTheDocument();
  });

  it('should display "No Workflows" text, when there are no workflows active in mem saver', async () => {
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: []})
        }
      },
      ui: {
        editMode: false,
        memSaver: fixtureMemSaver({
          activeWorkflowIds: []
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      },
    }));
    expect(screen.getByText(/The project does not have any workflows/i)).toBeInTheDocument();
    expect(screen.queryByText(/button at the Workflow Bar/i)).not.toBeInTheDocument();
  });

  it('should replace "No Workflows" with "Click button" text, when edit mode is on', async () => {
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: []})
        }
      },
      ui: {
        editMode: true,
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      },
    }));
    expect(screen.queryByText(/The project does not have any workflows/i)).not.toBeInTheDocument();
    expect(screen.getByText(/button at the Workflow Bar/i)).toBeInTheDocument();
  });

  it('should display 0 WidgetLayout components, when there are no workflows active in mem saver', async () => {
    const workflowA = fixtureWorkflowA();
    const workflowB = fixtureWorkflowB();
    const workflowC = fixtureWorkflowC();
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: [workflowA.id, workflowB.id]})
        },
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
          [workflowC.id]: workflowC,
        }
      },
      ui: {
        memSaver: fixtureMemSaver({
          activeWorkflowIds: []
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      }
    }));
    expect(screen.queryAllByText(strWidgetLayout, {exact: false}).length).toBe(0);
  });

  it('should display 2 WidgetLayout components, when there are 2 workflows active in mem saver', async () => {
    const workflowA = fixtureWorkflowA();
    const workflowB = fixtureWorkflowB();
    const workflowC = fixtureWorkflowC();
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: [workflowA.id, workflowB.id, workflowC.id]})
        },
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
          [workflowC.id]: workflowC,
        }
      },
      ui: {
        memSaver: fixtureMemSaver({
          activeWorkflowIds: [workflowA.id, workflowB.id]
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      }
    }));
    expect(screen.queryAllByText(strWidgetLayout, {exact: false}).length).toBe(2);
  });

  it('should set isVisible prop for a WidgetLayout of a current workflow', async () => {
    const workflowA = fixtureWorkflowA();
    const workflowB = fixtureWorkflowB();
    await setup(fixtureAppState({
      entities: {
        projects: {
          ...fixtureProjectAInColl({id: projectId, workflowIds: [workflowA.id, workflowB.id], currentWorkflowId: workflowB.id})
        },
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB
        }
      },
      ui: {
        memSaver: fixtureMemSaver({
          activeWorkflowIds: [workflowA.id, workflowB.id]
        }),
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectId,
        })
      }
    }));

    const layoutEls = screen.queryAllByText(strWidgetLayout, {exact: false});
    expect(layoutEls[0]).not.toHaveTextContent(strIsVisible);
    expect(layoutEls[1]).toHaveTextContent(strIsVisible);
  });
});
