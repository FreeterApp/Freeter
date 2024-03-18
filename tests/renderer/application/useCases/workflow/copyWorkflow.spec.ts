/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createCopyWorkflowUseCase } from '@/application/useCases/workflow/copyWorkflow';
import { AppState } from '@/base/state/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { fixtureCopyState } from '@tests/base/state/fixtures/copy';
import { fixtureWidgetA, fixtureWidgetB } from '@tests/base/fixtures/widget';
import { fixtureWorkflowA, fixtureWorkflowB } from '@tests/base/fixtures/workflow';
import { fixtureWidgetLayoutItemA, fixtureWidgetLayoutItemB } from '@tests/base/fixtures/widgetLayout';

async function setup(initState: AppState) {
  const [appStore] = await fixtureAppStore(initState);
  const copyWorkflowUseCase = createCopyWorkflowUseCase({
    appStore,
  });
  return {
    appStore,
    copyWorkflowUseCase,
  }
}

describe('copyWorkflowUseCase()', () => {
  it('should do nothing, if no such workflow exists', async () => {
    const widgetA = fixtureWidgetA()
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        copy: fixtureCopyState({}),
      }
    })
    const {
      appStore,
      copyWorkflowUseCase
    } = await setup(initState)
    const expectState = appStore.get();

    copyWorkflowUseCase('NO-SUCH-ID');

    expect(appStore.get()).toBe(expectState);
  })

  it('should add the workflow and its deps to the copy state', async () => {
    const widgetA = fixtureWidgetA()
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        copy: fixtureCopyState({}),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          workflows: {
            entities: {
              [workflowA.id]: {
                id: workflowA.id,
                deps: {
                  widgets: { [widgetA.id]: widgetA }
                },
                entity: workflowA
              }
            },
            list: [workflowA.id]
          }
        }
      }
    }
    const {
      appStore,
      copyWorkflowUseCase
    } = await setup(initState)

    copyWorkflowUseCase(workflowA.id);

    expect(appStore.get()).toEqual(expectState);
  })

  it('should move the workflow to the front of the copied workflows list, when it is already there', async () => {
    const widgetA = fixtureWidgetA()
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA
        },
        workflows: {
          [workflowA.id]: workflowA
        }
      },
      ui: {
        copy: fixtureCopyState({
          workflows: {
            entities: {
              [workflowA.id]: {
                id: workflowA.id,
                deps: {
                  widgets: { [widgetA.id]: widgetA }
                },
                entity: workflowA
              }
            },
            list: ['some-id', 'some-id2', workflowA.id, 'some-id3']
          }
        }),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          workflows: {
            ...initState.ui.copy.workflows,
            list: [workflowA.id, 'some-id', 'some-id2', 'some-id3']
          }
        }
      }
    }
    const {
      appStore,
      copyWorkflowUseCase
    } = await setup(initState)

    copyWorkflowUseCase(workflowA.id);

    expect(appStore.get()).toEqual(expectState);
  })

  it('should remove entities from the copy state, when there are too many items on the list', async () => {
    const widgetA = fixtureWidgetA()
    const workflowA = fixtureWorkflowA({ layout: [fixtureWidgetLayoutItemA({ widgetId: widgetA.id })] });
    const widgetB = fixtureWidgetB()
    const workflowB = fixtureWorkflowB({ layout: [fixtureWidgetLayoutItemB({ widgetId: widgetB.id })] });
    const initState = fixtureAppState({
      entities: {
        widgets: {
          [widgetA.id]: widgetA,
          [widgetB.id]: widgetB,
        },
        workflows: {
          [workflowA.id]: workflowA,
          [workflowB.id]: workflowB,
        }
      },
      ui: {
        copy: fixtureCopyState({
          workflows: {
            entities: {
              [workflowA.id]: {
                id: workflowA.id,
                deps: {
                  widgets: { [widgetA.id]: widgetA }
                },
                entity: workflowA
              }
            },
            list: ['some-id', 'some-id2', 'some-id3', 'some-id4', 'some-id5', 'some-id6', 'some-id7', 'some-id8', 'some-id9', workflowA.id]
          }
        }),
      }
    })
    const expectState: AppState = {
      ...initState,
      ui: {
        ...initState.ui,
        copy: {
          ...initState.ui.copy,
          workflows: {
            ...initState.ui.copy.workflows,
            entities: {
              [workflowB.id]: {
                id: workflowB.id,
                deps: {
                  widgets: { [widgetB.id]: widgetB }
                },
                entity: workflowB
              }
            },
            list: [workflowB.id, 'some-id', 'some-id2', 'some-id3', 'some-id4', 'some-id5', 'some-id6', 'some-id7', 'some-id8', 'some-id9']
          }
        }
      }
    }
    const {
      appStore,
      copyWorkflowUseCase
    } = await setup(initState)

    copyWorkflowUseCase(workflowB.id);

    expect(appStore.get()).toEqual(expectState);
  })

})
