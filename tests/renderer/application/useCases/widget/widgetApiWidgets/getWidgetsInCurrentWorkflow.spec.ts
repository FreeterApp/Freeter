/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureWidgetA, fixtureWidgetB, fixtureWidgetC, fixtureWidgetD } from '@tests/base/fixtures/widget';
import { createGetWidgetsInCurrentWorkflowUseCase } from '@/application/useCases/widget/widgetApiWidgets/getWidgetsInCurrentWorkflow';
import { fixtureWorkflowA, fixtureWorkflowB } from '@tests/base/fixtures/workflow';
import { fixtureProjectA } from '@tests/base/fixtures/project';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB, fixtureWidgetLayoutItemC, fixtureWidgetLayoutItemD } from '@tests/base/fixtures/widgetLayout';
import { fixtureWidgetTypeA, fixtureWidgetTypeB } from '@tests/base/fixtures/widgetType';
import { fixtureProjectSwitcher } from '@tests/base/state/fixtures/projectSwitcher';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const getWidgetsInCurrentWorkflowUseCase = createGetWidgetsInCurrentWorkflowUseCase({
    appStore,
  });
  return {
    appStore,
    getWidgetsInCurrentWorkflowUseCase,
  }
}

describe('getWidgetsInCurrentWorkflowUseCase()', () => {
  it('should return empty array, if there is no current project', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id });
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: 'NO-SUCH-ID'
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase(widgetTypeA.id);

    expect(res).toEqual([]);
  })

  it('should return empty array, if there is no current workflow', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id });
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const projectA = fixtureProjectA({ currentWorkflowId: 'NO-SUCH-ID', workflowIds: [workflowA.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase(widgetTypeA.id);

    expect(res).toEqual([]);
  })

  it('should return empty array, if there is no specified widget type', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id });
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase('NO-SUCH-ID');

    expect(res).toEqual([]);
  })

  it('should return data for widgets of the specified type on the current workflow only', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetTypeB = fixtureWidgetTypeB();
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id });
    const widgetB = fixtureWidgetB({ type: widgetTypeB.id });
    const widgetC = fixtureWidgetC({ type: widgetTypeA.id });
    const widgetD = fixtureWidgetD({ type: widgetTypeA.id });
    const workflowA = fixtureWorkflowA({
      layout: [
        fixtureWidgetLayoutItemA({ widgetId: widgetA.id }),
        fixtureWidgetLayoutItemB({ widgetId: widgetB.id }),
        fixtureWidgetLayoutItemC({ widgetId: widgetC.id })
      ]
    });
    const workflowB = fixtureWorkflowB({ layout: [fixtureWidgetLayoutItemD({ widgetId: widgetD.id })] })
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id, workflowB.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
          [widgetC.id]: widgetC
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA,
          [widgetTypeB.id]: widgetTypeB,
        },
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase(widgetTypeA.id);

    expect(res).toEqual([
      expect.objectContaining({ id: widgetA.id }),
      expect.objectContaining({ id: widgetC.id }),
    ]);
  })

  it('should return id, name and exposed api of widgets', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const widgetA = fixtureWidgetA({ type: widgetTypeA.id, exposedApi: { some: 'object' } });
    const workflowA = fixtureWorkflowA({
      layout: [
        fixtureWidgetLayoutItemA({ widgetId: widgetA.id }),
      ]
    });
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA,
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA,
        },
        workflows: {
          [workflowA.id]: workflowA,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase(widgetTypeA.id);

    expect(res).toEqual([{
      id: widgetA.id,
      name: widgetA.coreSettings.name,
      api: widgetA.exposedApi
    }]);
  })

  it('should return empty api object, if the widget does not expose any api', async () => {
    const widgetTypeA = fixtureWidgetTypeA();
    const { exposedApi: _, ...widgetA } = fixtureWidgetA({ type: widgetTypeA.id });
    const workflowA = fixtureWorkflowA({
      layout: [
        fixtureWidgetLayoutItemA({ widgetId: widgetA.id }),
      ]
    });
    const projectA = fixtureProjectA({ currentWorkflowId: workflowA.id, workflowIds: [workflowA.id] });
    const initState = fixtureAppState({
      entities: {
        projects: {
          [projectA.id]: projectA
        },
        widgets: {
          [widgetA.id]: widgetA,
        },
        widgetTypes: {
          [widgetTypeA.id]: widgetTypeA,
        },
        workflows: {
          [workflowA.id]: workflowA,
        }
      },
      ui: {
        projectSwitcher: fixtureProjectSwitcher({
          currentProjectId: projectA.id
        })
      }
    })
    const {
      getWidgetsInCurrentWorkflowUseCase
    } = await setup(initState)

    const res = getWidgetsInCurrentWorkflowUseCase(widgetTypeA.id);

    expect(res).toEqual([{
      id: widgetA.id,
      name: widgetA.coreSettings.name,
      api: {}
    }]);
  })
})
